import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copy public directory to dist
const copyDir = (src, dest) => {
  try {
    // Create destination directory if it doesn't exist
    if (!statSync(dest).isDirectory()) {
      mkdirSync(dest, { recursive: true });
    }
  } catch (err) {
    mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
};

// Copy public directory
const publicDir = join(__dirname, '../public');
const distDir = join(__dirname, '../dist');

try {
  copyDir(publicDir, distDir);
  console.log('Successfully copied public directory to dist');
} catch (err) {
  console.error('Error copying public directory:', err);
}

// Run prisma generate
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error('Error running prisma generate:', error);
    return;
  }
  if (stderr) {
    console.error('Prisma generate stderr:', stderr);
  }
  console.log('Prisma generate stdout:', stdout);
});
