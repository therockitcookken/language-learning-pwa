import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data_temp');

function fetchUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching ${url} ...`);
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
          console.log(`Saved to ${destPath}`);
          resolve(destPath);
        });
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function testFetchZh() {
  const sources = [
    { url: 'https://raw.githubusercontent.com/open-dict-data/cedict-json/master/cedict.json', file: 'cedict.json' },
    { url: 'https://raw.githubusercontent.com/yomikun/cedict-json/master/cedict.json', file: 'cedict_yomi.json' }
  ];

  for (const s of sources) {
    try {
      await fetchUrl(s.url, path.join(DATA_DIR, s.file));
    } catch (e) {
      console.error(`Failed ${s.url}:`, e.message);
    }
  }
}

testFetchZh();
