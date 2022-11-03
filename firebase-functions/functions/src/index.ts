import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';
import * as childProcess from 'child_process';
import * as vision from '@google-cloud/vision';

const mkdirp = fs.promises.mkdir;
const { promisify } = util;
const exec = promisify(childProcess.exec);

const BLURRED_FOLDER = 'blurred';

admin.initializeApp();

const db = admin.firestore();

exports.writeRates = functions.firestore
  .document('/rates/{documentId}')
  .onWrite(async (change, context) => {
    functions.logger.log('eventType', context.eventType);

    const rate = change.after.exists ? change.after.data() : null;

    if (rate) {
      const rates = await db
        .collection('rates')
        .where('placeId', '==', rate.placeId)
        .get();

      functions.logger.error('onWrite', 'rates', rates);

      const valuesRate: number[] = [];

      rates.forEach((doc) => valuesRate.push(doc.data().value));

      const total = valuesRate.reduce((a, b) => a + b, 0);

      const finalRate = Number(
        Number(total / valuesRate.length).toPrecision(1)
      );

      functions.logger.error(
        'onWrite',
        'Place: ',
        rate.placeId,
        'finalRate:',
        finalRate
      );

      await db.doc(`places/${rate.placeId}`).set(
        {
          rating: finalRate,
        },
        {
          merge: true,
        }
      );
    } else {
      functions.logger.error('onWrite', 'NOT FOUND USER');
    }
  });

exports.writePlace = functions.firestore
  .document('/places/{documentId}')
  .onWrite(async (change, context) => {
    functions.logger.log('eventType', context.eventType);

    // Grab the current value of what was written to Firestore.
    const place = change.after.exists ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    const oldPlace = change.before.data();

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log(
      'OLD PLACE',
      context.params.documentId,
      oldPlace?.name
    );
    functions.logger.log('NEW PLACE', context.params.documentId, place?.name);

    if (place) {
      if (Number(place.rating) < 0) {
        place.rating = 0;
      } else if (Number(place.rating) > 5) {
        place.rating = 5;
      }

      place.search = [
        ...place.title.split(' ').filter((term: string) => term.length > 3),
        ...place.description
          .split(' ')
          .filter((term: string) => term.length > 3),
        ...place?.address?.district
          ?.split(' ')
          .filter((term: string) => term.length > 3),
        ...place?.address?.street
          ?.split(' ')
          .filter((term: string) => term.length > 3),
      ];

      place.search = place.search.filter(function (item: string, pos: number) {
        return place.search.indexOf(item) == pos;
      });

      functions.logger.log(
        'FIXED PLACE',
        context.params.documentId,
        place?.name,
        'rating: ' + place.rating
      );

      try {
        await change.after.ref.set(place, { merge: true });
      } catch (e) {
        functions.logger.error('UPDATE PLACE ERROR', e);
      }

      try {
        const currentPlacesTop = await db.collection('places-top').get();

        const batch = db.batch();
        currentPlacesTop.docs.forEach((doc) => {
          batch.delete(doc.ref);
          functions.logger.info('DELETE PLACE TOP', doc.ref);
        });
        await batch.commit();

        const placesTop = await db
          .collection('places')
          .orderBy('views', 'desc')
          .limit(5)
          .get();

        let index = 0;
        placesTop.forEach((doc) => {
          const data = doc.data();
          console.log(`${index}° - ${data.name} [${data.views}]`);

          db.collection('places-top')
            .add(data)
            .finally(() => functions.logger.info('ADD PLACE TOP'));
        });
      } catch (e) {
        functions.logger.error('SELECT PLACES TOP ERROR', e);
      }

      return true;
    } else {
      functions.logger.log('place not found');
      return false;
    }
  });

exports.blurOffensiveImages = functions.storage
  .object()
  .onFinalize(async (object) => {
    // Ignore things we've already blurred
    if (object.name?.startsWith(`${BLURRED_FOLDER}/`)) {
      functions.logger.log(
        `Ignoring upload "${object.name}" because it was already blurred.`
      );
      return null;
    }

    // Check the image content using the Cloud Vision API.
    const visionClient = new vision.ImageAnnotatorClient();
    const data = await visionClient.safeSearchDetection(
      `gs://${object.bucket}/${object.name}`
    );
    const safeSearchResult = data[0].safeSearchAnnotation;
    functions.logger.log(
      `SafeSearch results on image "${object.name}"`,
      safeSearchResult
    );

    // Tune these detection likelihoods to suit your app.
    // The current settings show the most strict configuration
    // Available likelihoods are defined in https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageResponse#likelihood
    if (
      safeSearchResult &&
      (safeSearchResult.adult !== 'VERY_UNLIKELY' ||
        safeSearchResult.spoof !== 'VERY_UNLIKELY' ||
        safeSearchResult.medical !== 'VERY_UNLIKELY' ||
        safeSearchResult.violence !== 'VERY_UNLIKELY' ||
        safeSearchResult.racy !== 'VERY_UNLIKELY')
    ) {
      functions.logger.log('Offensive image found. Blurring.');
      return blurImage(object.name, object.bucket, object.metadata);
    }

    return null;
  });

/**
 * Blurs the given image located in the given bucket using ImageMagick.
 */
async function blurImage(filePath: any, bucketName: any, metadata: any) {
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const bucket = admin.storage().bucket(bucketName);

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir, { recursive: true });
  functions.logger.log('Temporary directory has been created', tempLocalDir);

  // Download file from bucket.
  await bucket.file(filePath).download({ destination: tempLocalFile });
  functions.logger.log('The file has been downloaded to', tempLocalFile);

  // Blur the image using ImageMagick.
  await exec(
    `convert "${tempLocalFile}" -channel RGBA -blur 0x8 "${tempLocalFile}"`
  );
  functions.logger.log('Blurred image created at', tempLocalFile);

  // Uploading the Blurred image.
  await bucket.upload(tempLocalFile, {
    destination: `${BLURRED_FOLDER}/${filePath}`,
    metadata: { metadata: metadata }, // Keeping custom metadata.
  });
  functions.logger.log('Blurred image uploaded to Storage at', filePath);

  // Clean up the local file
  fs.unlinkSync(tempLocalFile);
  functions.logger.log('Deleted local file', filePath);
}
