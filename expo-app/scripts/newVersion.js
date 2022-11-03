const { readFileSync, writeFileSync } = require('fs');

const content = JSON.parse(readFileSync('./app.json', { encoding: 'utf-8' }));

content.expo.android.versionCode = Number(content.expo.android.versionCode) + 1;
content.expo.version = `${content.expo.version.split('.')[0]}.${
  content.expo.version.split('.')[1]
}.${Number(content.expo.version.split('.')[2]) + 1}`;

writeFileSync('./app.json', JSON.stringify(content, null, 2));

console.log(
  'Android Version Code updated to ' + content.expo.android.versionCode
);
