import fs from 'fs';
import { pipeline } from 'stream/promises';

async function download(url, dest) {
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
  const fileStream = fs.createWriteStream(dest);
  await pipeline(res.body, fileStream);
  console.log(`Saved to ${dest}`);
}

async function main() {
  if (!fs.existsSync('public/fonts')) {
    fs.mkdirSync('public/fonts', { recursive: true });
  }
  
  await download(
    'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansJP/NotoSansJP-Regular.ttf',
    'public/fonts/NotoSansJP-Regular.ttf'
  );
  
  await download(
    'https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerifJP/NotoSerifJP-Bold.ttf',
    'public/fonts/NotoSerifJP-Bold.ttf'
  );
}

main().catch(console.error);
