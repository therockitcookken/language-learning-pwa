import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');
const DATASETS_DIR = path.resolve(ROOT_DIR, 'apps/web/src/lib/data/datasets');

const emptyPayload = JSON.stringify({ success: true, count: 0, data: [] }, null, 2);

function main() {
  console.log("Clearing all dataset JSON files...");

  const files = ['zh-3k.json', 'zh-10k.json', 'zh-20k.json', 'en-3k.json', 'en-10k.json', 'en-20k.json'];

  for (const file of files) {
    const targetPath = path.join(DATASETS_DIR, file);
    fs.writeFileSync(targetPath, emptyPayload, 'utf-8');
    console.log(`Cleared: ${file}`);
  }

  console.log("SUCCESS: All dataset JSON files have been reset to empty!");
}

main();
