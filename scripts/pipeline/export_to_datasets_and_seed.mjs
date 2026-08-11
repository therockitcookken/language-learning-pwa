import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const DATA_TEMP_DIR = path.resolve(ROOT_DIR, 'data_temp');
const DATASETS_DIR = path.resolve(ROOT_DIR, 'apps/web/src/lib/data/datasets');

const zhAcceptedFile = path.resolve(DATA_TEMP_DIR, 'pipeline/accepted/zh_accepted.json');
const enAcceptedFile = path.resolve(DATA_TEMP_DIR, 'pipeline/accepted/en_accepted.json');

function main() {
  console.log("Exporting verified pipelines to production dataset JSON files...");

  const zhData = JSON.parse(fs.readFileSync(zhAcceptedFile, 'utf8'));
  const enData = JSON.parse(fs.readFileSync(enAcceptedFile, 'utf8'));

  console.log(`Loaded ${zhData.length} Chinese records and ${enData.length} English records.`);

  // Write Chinese Datasets
  fs.writeFileSync(path.join(DATASETS_DIR, 'zh-3k.json'), JSON.stringify({ success: true, count: 3000, data: zhData.slice(0, 3000) }, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATASETS_DIR, 'zh-10k.json'), JSON.stringify({ success: true, count: 10000, data: zhData.slice(0, 10000) }, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATASETS_DIR, 'zh-20k.json'), JSON.stringify({ success: true, count: zhData.length, data: zhData }, null, 2), 'utf-8');

  // Write English Datasets
  fs.writeFileSync(path.join(DATASETS_DIR, 'en-3k.json'), JSON.stringify({ success: true, count: 3000, data: enData.slice(0, 3000) }, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATASETS_DIR, 'en-10k.json'), JSON.stringify({ success: true, count: 10000, data: enData.slice(0, 10000) }, null, 2), 'utf-8');
  fs.writeFileSync(path.join(DATASETS_DIR, 'en-20k.json'), JSON.stringify({ success: true, count: enData.length, data: enData }, null, 2), 'utf-8');

  console.log("SUCCESS: Exported all JSON datasets (3k, 10k, 20k) cleanly!");
}

main();
