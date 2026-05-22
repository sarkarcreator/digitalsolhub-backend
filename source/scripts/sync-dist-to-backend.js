import fs from 'fs';
import path from 'path';

const distAssets = path.resolve(process.cwd(), 'dist', 'assets');
const targetAssets = path.resolve(process.cwd(), '..', '..', 'laravel-backend', 'public', 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sync() {
  if (!fs.existsSync(distAssets)) {
    console.error('dist/assets not found. Run build first.');
    process.exit(1);
  }
  ensureDir(targetAssets);

  const srcFiles = fs.readdirSync(distAssets);
  const dstFiles = fs.readdirSync(targetAssets);

  // Copy/overwrite files from dist to backend public assets
  srcFiles.forEach(f => {
    const src = path.join(distAssets, f);
    const dst = path.join(targetAssets, f);
    fs.copyFileSync(src, dst);
    console.log('copied', f);
  });

  // Remove files in target that aren't in dist
  dstFiles.forEach(f => {
    if (!srcFiles.includes(f)) {
      try {
        fs.unlinkSync(path.join(targetAssets, f));
        console.log('removed stale', f);
      } catch (e) {
        // ignore
      }
    }
  });
}

sync();
