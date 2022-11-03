import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { Category } from '../types/Category';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  QueryConstraint,
  setDoc,
  where as whereFB,
  limit as limitFB,
  getDoc,
  orderBy,
  onSnapshot,
  Unsubscribe,
  addDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  documentId,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { Place } from '../types/Place';
import { useAuth } from './AuthContext';
import { useApp } from './AppContext';
import { Photo } from '../types/Photo';

export type DataContextType = {
  uploadFile: (uri: string) => Promise<string>;
  getCategories: () => Promise<Category[]>;
  putPlace: (place: Place) => Promise<void>;
  getPlaces: ({ where }: { where?: QueryConstraint }) => Promise<Place[]>;
  getPlacesSearch: (value: string) => Promise<Place[]>;
  getPlacesTop: () => Promise<Place[]>;
  getPlacesFavorites: () => Promise<Place[]>;
  addFavorites: (placesId: number[]) => Promise<void>;
  removeFavorites: (placesId: number[]) => Promise<void>;
  getFavorites: () => Promise<number[]>;
  putView: (placeId: number) => Promise<void>;
  putRate: (placeId: number, value: number) => Promise<void>;
  watchPlacesFavorites: (onReceived: (places: Place[]) => void) => Unsubscribe;
  watchUser: (onReceived?: (data: UserData) => void) => Unsubscribe;
  userData: UserData;
  setUserData: (value: UserData) => void;
  putPhoto: (placeId: number, photoURL: string) => Promise<Photo>;
  getPhotos: (photosId: string[]) => Promise<Photo[]>;
  getUserPhotos: () => Promise<Photo[]>;
  watchUserPhotos: (onReceived: (photos: Photo[]) => void) => Unsubscribe;
  deletePhoto: (photoId: string) => Promise<void>;
  putPhotoView: (photoId: string) => Promise<void>;
};

export const DataContext = createContext<DataContextType>({
  uploadFile: () => new Promise<string>(() => {}),
  getCategories: () => new Promise<Category[]>(() => {}),
  putPlace: () => new Promise<void>(() => {}),
  getPlaces: () => new Promise<Place[]>(() => {}),
  getPlacesTop: () => new Promise<Place[]>(() => {}),
  getPlacesSearch: () => new Promise<Place[]>(() => {}),
  getPlacesFavorites: () => new Promise<Place[]>(() => {}),
  addFavorites: () => new Promise<void>(() => {}),
  removeFavorites: () => new Promise<void>(() => {}),
  getFavorites: () => new Promise<number[]>(() => {}),
  putView: () => new Promise<void>(() => {}),
  putRate: () => new Promise<void>(() => {}),
  watchPlacesFavorites: () => {
    return {} as Unsubscribe;
  },
  watchUser: () => {
    return {} as Unsubscribe;
  },
  userData: {} as UserData,
  setUserData: () => {},
  putPhoto: () => new Promise<Photo>(() => {}),
  getPhotos: () => new Promise<Photo[]>(() => {}),
  getUserPhotos: () => new Promise<Photo[]>(() => {}),
  watchUserPhotos: () => {
    return {} as Unsubscribe;
  },
  deletePhoto: () => new Promise<void>(() => {}),
  putPhotoView: () => new Promise<void>(() => {}),
});

export type DataProviderProps = {
  children: any;
};

export type UserDataRate = {
  placeId: number;
  value: number;
};

export type UserData = {
  favorites: number[];
  photos: string[];
  rates: UserDataRate[];
};

export const DataProvider = ({ children }) => {
  const db = getFirestore();
  const { user, setOpen } = useAuth();
  const { showToast } = useApp();
  const [userData, setUserData] = useState<UserData>({
    favorites: [],
    photos: [],
    rates: [],
  });

  const getBlobFile = useCallback((uri: string) => {
    return new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response as Blob);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }, []);

  const uploadFile = useCallback((uri: string) => {
    console.log('uploadFile', uri);
    return new Promise<string>((resolve, reject) => {
      getBlobFile(uri)
        .then(async (blob) => {
          const storage = getStorage();
          const name = String(uuid.v4());
          const fileRef = ref(storage, name);
          try {
            await uploadBytes(fileRef, blob);
            return await getDownloadURL(fileRef);
          } catch (e) {
            reject(new TypeError(e.message));
          }
        })
        .then((url) => {
          console.log('uploadFile', url);
          resolve(url);
        })
        .catch(reject);
    });
  }, []);

  const getPlaces = useCallback(
    ({
      where,
      limit,
    }: {
      where?: QueryConstraint;
      limit?: QueryConstraint;
    }) => {
      return new Promise<Place[]>((resolve, reject) => {
        const q = query(
          collection(db, 'places'),
          where ? where : whereFB('id', '>', 0),
          limit ? limit : limitFB(5)
        );
        getDocs(q)
          .then((querySnapshot) => {
            const items: Place[] = [];
            querySnapshot.forEach((doc) => items.push(doc.data() as Place));

            resolve(items);
          })
          .catch(reject);
      });
    },
    [db]
  );

  const getPlacesTop = useCallback(() => {
    return new Promise<Place[]>((resolve, reject) => {
      const q = query(collection(db, 'places-top'), orderBy('views', 'desc'));
      getDocs(q)
        .then((querySnapshot) => {
          const items: Place[] = [];
          querySnapshot.forEach((doc) => items.push(doc.data() as Place));
          resolve(items);
        })
        .catch(reject);
    });
  }, [db]);

  const getPlacesSearch = useCallback(
    (value: string) => {
      return new Promise<Place[]>((resolve, reject) => {
        const q = query(collection(db, 'places'));
        getDocs(q)
          .then((querySnapshot) => {
            const items: Place[] = [];
            querySnapshot.forEach((doc) => items.push(doc.data() as Place));
            resolve(items);
          })
          .catch(reject);
      });
    },
    [db]
  );

  const getCategories = useCallback(() => {
    return new Promise<Category[]>((resolve, reject) => {
      const q = query(collection(db, 'categories'));
      getDocs(q)
        .then((querySnapshot) => {
          const categories: Category[] = [];
          querySnapshot.forEach((doc) =>
            categories.push(doc.data() as Category)
          );
          resolve(categories);
        })
        .catch(reject);
    });
  }, [db]);

  const putPlace = useCallback(
    (place: Place) => {
      return new Promise<void>((resolve, reject) => {
        place = Object.assign(
          {
            cover: {
              url: `https://conexao-arte.web.app/images/`,
            },
            square: {
              url: `https://conexao-arte.web.app/images/`,
            },
            lat: -23.0,
            lng: -46.0,
            rating: 5,
            photos: [],
          },
          place
        );
        place.categoryId = place.category.id;
        const placesRef = collection(db, 'places');
        setDoc(doc(placesRef, String(place.id)), place, {
          merge: true,
        })
          .then(() => resolve())
          .catch(reject);
      });
    },
    [db]
  );

  const getFavorites = useCallback(() => {
    return new Promise<number[]>((resolve, reject) => {
      if (user !== null) {
        const docRef = doc(db, 'users', user.id);

        getDoc(docRef)
          .then((docSnap: any) => {
            const data = docSnap.data();
            resolve(
              data && data.favorites instanceof Array ? data.favorites : []
            );
          })
          .catch((error) => {
            showToast(error.message);
            reject(error);
          });
      } else {
        setOpen(true);
        reject(
          new TypeError('Você precisa efeturar o login para ter favoritos.')
        );
      }
    });
  }, [user, setOpen]);

  const watchUser = useCallback(
    (onReceive?: (data: UserData) => void) => {
      const docRef = doc(db, 'users', user.id);

      return onSnapshot(docRef, (snap) => {
        const data = snap.data() as UserData;
        setUserData(data);
        if (typeof onReceive === 'function') {
          onReceive(data);
        }
      });
    },
    [user]
  );

  const watchPlacesFavorites = useCallback(
    (onReceive: (places: Place[]) => void) => {
      const docRef = doc(db, 'users', user.id);

      return onSnapshot(docRef, (snap) => {
        if ((snap.data().favorites ?? []).length === 0) {
          onReceive([]);
        } else {
          getPlaces({
            where: whereFB('id', 'in', snap.data().favorites),
          }).then((places) => {
            if (typeof onReceive === 'function') {
              onReceive(places);
            }
          });
        }
      });
    },
    [user, getPlaces]
  );

  const getPlacesFavorites = useCallback(() => {
    return new Promise<Place[]>((resolve, reject) => {
      getFavorites()
        .then((favorites) => {
          if ((favorites ?? []).length === 0) {
            resolve([]);
          } else {
            return getPlaces({
              where: whereFB('id', 'in', favorites),
            });
          }
        })
        .then(resolve)
        .catch(reject);
    });
  }, [getFavorites, getPlaces]);

  const setFavorites = useCallback(
    (favorites: number[]) => {
      return new Promise<void>((resolve, reject) => {
        if (user) {
          const data = {
            favorites: favorites.filter(
              (item, pos) => favorites.indexOf(item) == pos
            ),
          };
          setDoc(doc(db, 'users', user.id), data, {
            merge: true,
          })
            .then(resolve)
            .catch(reject);
        } else {
          setOpen(true);
          reject(
            new TypeError('Você precisa efeturar o login para ter favoritos.')
          );
        }
      });
    },
    [user, setOpen]
  );

  const addFavorites = useCallback(
    (placesId: number[]) => {
      return new Promise<void>((resolve, reject) => {
        getFavorites()
          .then((favorites) => {
            setFavorites([...favorites, ...placesId]);
          })
          .then(resolve)
          .catch((error) => {
            showToast(error.message);
            reject(error);
          });
      });
    },
    [getFavorites]
  );

  const removeFavorites = useCallback(
    (placesId: number[]) => {
      return new Promise<void>((resolve, reject) => {
        getFavorites()
          .then((favorites) => {
            setFavorites(favorites.filter((id) => !placesId.includes(id)));
          })
          .then(resolve)
          .catch((error) => {
            showToast(error.message);
            reject(error);
          });
      });
    },
    [getFavorites]
  );

  const getPlace = useCallback((placeId: number) => {
    return new Promise<Place>((resolve, reject) => {
      const docRef = doc(db, 'places', String(placeId));

      getDoc(docRef)
        .then((docSnap) => resolve(docSnap.data() as Place))
        .catch((error) => {
          showToast('Não foi possível carregar os dados do local.');
          reject(error);
        });
    });
  }, []);

  const putView = useCallback(
    (placeId: number) => {
      return new Promise<void>((resolve, reject) => {
        getPlace(placeId)
          .then((data) => {
            const views = (data.views ?? 0) + 1;
            return setDoc(
              doc(db, 'places', String(placeId)),
              {
                views,
              },
              {
                merge: true,
              }
            );
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            showToast('Não foi possível registrar a visualização deste local.');
            reject(error);
          });
      });
    },
    [user]
  );

  const getUser = useCallback(() => {
    return new Promise<UserData>((resolve, reject) => {
      getDoc(doc(db, 'users', user.id))
        .then((snap) => {
          resolve(snap.data() as UserData);
        })
        .catch(reject);
    });
  }, [user]);

  const putRate = useCallback(
    (placeId: number, value: number) => {
      return new Promise<void>((resolve, reject) => {
        if (user) {
          getUser()
            .then((data) => {
              if (value < 0) {
                value = 0;
              } else if (value > 5) {
                value = 5;
              }

              data.rates = [
                ...(data.rates ?? []).filter(
                  (dataRate) => dataRate.placeId !== placeId
                ),
                { placeId, value } as UserDataRate,
              ];

              return setDoc(doc(db, 'users', user.id), data, {
                merge: true,
              });
            })
            .then(() => {
              return setDoc(
                doc(db, 'rates', user.id + '-' + placeId),
                {
                  placeId,
                  userId: user.id,
                  value,
                },
                {
                  merge: true,
                }
              );
            })
            .then(resolve)
            .catch(reject);
        } else {
          setOpen(true);
          reject(
            new TypeError('Você precisa efeturar o login para ter favoritos.')
          );
        }
      });
    },
    [user, getUser]
  );

  const addPhotoToUser = useCallback(
    (photoDocRef: DocumentReference<DocumentData>) => {
      console.log('addPhotoToUser');
      return new Promise<DocumentReference<DocumentData>>((resolve, reject) => {
        getUser()
          .then((userData) => {
            userData.photos = userData.photos ?? [];
            userData.photos = [...userData.photos, photoDocRef.id];
            userData.photos = userData.photos.filter(
              (item, pos) => userData.photos.indexOf(item) == pos
            );
            return setDoc(
              doc(db, 'users', user.id),
              {
                photos: userData.photos,
              },
              {
                merge: true,
              }
            );
          })
          .then(() => resolve(photoDocRef))
          .catch(reject);
      });
    },
    [user, getUser]
  );

  const addPhotoToPlace = useCallback(
    (photoDocRef: DocumentReference<DocumentData>, placeId: number) => {
      console.log('addPhotoToPlace');
      return new Promise<DocumentReference<DocumentData>>((resolve, reject) => {
        getPlace(placeId)
          .then((place) => {
            place.photos = place.photos ?? [];
            place.photos = [...place.photos, photoDocRef.id];
            place.photos = place.photos.filter(
              (item, pos) => place.photos.indexOf(item) == pos
            );
            return putPlace(place);
          })
          .then(() => resolve(photoDocRef))
          .catch(reject);
      });
    },
    [user, getPlace]
  );

  const putPhoto = useCallback(
    (placeId: number, photoURL: string) => {
      console.log('putPhoto', placeId, photoURL);
      return new Promise<Photo>((resolve, reject) => {
        addDoc(collection(db, 'photos'), {
          placeId,
          url: photoURL,
          user,
          views: 0,
          createdAt: serverTimestamp(),
        })
          .then((docRef) => {
            setDoc(
              doc(db, 'photos', docRef.id),
              {
                id: docRef.id,
              },
              {
                merge: true,
              }
            ).finally(() => {});
            return docRef;
          })
          .then((docRef) => addPhotoToUser(docRef))
          .then((docRef) => addPhotoToPlace(docRef, placeId))
          .then((docRef) => getDoc(doc(db, 'photos', docRef.id)))
          .then((docSnap) => resolve(docSnap.data() as Photo))
          .catch((error) => {
            showToast('Não foi possível adicionar a foto.');
            reject(error);
          });
      });
    },
    [user, addPhotoToUser, addPhotoToPlace]
  );

  const getPhotos = useCallback(
    (photosId: string[]) => {
      return new Promise<Photo[]>((resolve, reject) => {
        getDocs(
          query(
            collection(db, 'photos'),
            whereFB(documentId(), 'in', photosId),
            limit(50)
          )
        )
          .then((docsSnap) => {
            const photos: Photo[] = [];
            docsSnap.forEach((docSnap) => photos.push(docSnap.data() as Photo));
            resolve(photos);
          })
          .catch(reject);
      });
    },
    [getFavorites, getPlaces]
  );

  const getUserPhotos = useCallback(() => {
    return new Promise<Photo[]>((resolve, reject) => {
      if (userData) {
        getPhotos(userData.photos).then(resolve).catch(reject);
      }
    });
  }, [getPhotos, userData]);

  const deletePhoto = useCallback(
    (photoId: string) => {
      return new Promise<void>((resolve, reject) => {
        getPhotos([photoId]).then((photos) => {
          if (photos.length > 0) {
            deleteDoc(doc(db, 'photos', photoId))
              .then(() =>
                setDoc(
                  doc(db, 'users', user.id),
                  {
                    photos: userData.photos.filter((id) => id !== photoId),
                  },
                  {
                    merge: true,
                  }
                )
              )
              .then(() => getPlace(photos[0].placeId))
              .then((place) => {
                place.photos = place.photos.filter((id) => id !== photoId);
                return putPlace(place);
              })
              .then(resolve)
              .catch(reject);
          }
        });
      });
    },
    [userData, user, putPlace]
  );

  const watchUserPhotos = useCallback(
    (onReceive: (photos: Photo[]) => void) => {
      const docRef = doc(db, 'users', user.id);

      return onSnapshot(docRef, (snap) => {
        if ((snap.data().photos ?? []).length === 0) {
          onReceive([]);
        } else {
          getUserPhotos().then((photos) => {
            if (typeof onReceive === 'function') {
              onReceive(photos);
            }
          });
        }
      });
    },
    [user, getUserPhotos]
  );

  const putPhotoView = useCallback(
    (photoId: string) => {
      return new Promise<void>((resolve, reject) => {
        getPhotos([photoId])
          .then((photos) => {
            if (photos.length > 0) {
              return setDoc(
                doc(db, 'photos', photoId),
                {
                  views: photos[0].views + 1,
                },
                {
                  merge: true,
                }
              );
            } else {
              reject(new TypeError('Photo not found.'));
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      const unsubscribe = watchUser();
      return () => unsubscribe();
    }
  }, [watchUser, user]);

  return (
    <DataContext.Provider
      value={{
        uploadFile,
        getCategories,
        putPlace,
        getPlaces,
        addFavorites,
        removeFavorites,
        getFavorites,
        putView,
        putRate,
        getPlacesSearch,
        getPlacesTop,
        getPlacesFavorites,
        watchPlacesFavorites,
        userData,
        setUserData,
        watchUser,
        putPhoto,
        getPhotos,
        getUserPhotos,
        watchUserPhotos,
        deletePhoto,
        putPhotoView,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(`Data context not found.`);
  }
  return context;
};
