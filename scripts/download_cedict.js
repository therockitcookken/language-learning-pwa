import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data_temp');

function fetchUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching CC-CEDICT from ${url} ...`);
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved CC-CEDICT to ${destPath}`);
          resolve(destPath);
        });
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

const url = 'https://raw.githubusercontent.com/maplethief/cc-cedict/master/cedict_ts.u8';
fetchUrl(url, path.join(DATA_DIR, 'cedict.u8'));
