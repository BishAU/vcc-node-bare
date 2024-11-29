import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

interface ImageMetadata {
  filename: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: number;
  format: string;
  altText: string;
  attribution?: string;
  location?: string;
  category: 'regional' | 'mission' | 'sponsor';
  tags: string[];
}

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

async function generateImageMetadata(filepath: string): Promise<ImageMetadata> {
  const stats = await fs.stat(filepath);
  const metadata = await sharp(filepath).metadata();
  const filename = path.basename(filepath);
  const category = determineCategory(filepath);

  return {
    filename,
    dimensions: {
      width: metadata.width || 0,
      height: metadata.height || 0,
    },
    size: stats.size,
    format: metadata.format || '',
    altText: generateAltText(filename, category),
    category,
    tags: generateTags(filename, category),
  };
}

function determineCategory(filepath: string): 'regional' | 'mission' | 'sponsor' {
  if (filepath.includes('regional')) return 'regional';
  if (filepath.includes('mission')) return 'mission';
  return 'sponsor';
}

function generateAltText(filename: string, category: string): string {
  const name = filename.replace(/\.(jpg|jpeg|png|webp)$/, '');
  const parts = name.split('-');

  switch (category) {
    case 'regional':
      return `Scenic view of ${toTitleCase(parts.join(' '))} region in Victoria`;
    case 'mission':
      return `Professional ${parts.join(' ')} scene in Regional Victoria`;
    case 'sponsor':
      return `${toTitleCase(parts.join(' '))} logo`;
    default:
      return toTitleCase(parts.join(' '));
  }
}

function generateTags(filename: string, category: string): string[] {
  const name = filename.replace(/\.(jpg|jpeg|png|webp)$/, '');
  const parts = name.split('-');
  const tags = [...parts];

  switch (category) {
    case 'regional':
      tags.push('victoria', 'region', 'landscape');
      break;
    case 'mission':
      tags.push('professional', 'workplace', 'regional-victoria');
      break;
    case 'sponsor':
      tags.push('logo', 'partner', 'organization');
      break;
  }

  return tags.map(tag => tag.toLowerCase());
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function writeMetadataFile(metadata: ImageMetadata[]): Promise<void> {
  const metadataPath = path.join(IMAGES_DIR, 'metadata.json');
  await fs.writeFile(
    metadataPath,
    JSON.stringify({ images: metadata }, null, 2)
  );
}

async function scanDirectory(dir: string): Promise<ImageMetadata[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const metadata: ImageMetadata[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subDirMetadata = await scanDirectory(fullPath);
      metadata.push(...subDirMetadata);
    } else if (isImageFile(entry.name)) {
      try {
        const imageMetadata = await generateImageMetadata(fullPath);
        metadata.push(imageMetadata);
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error);
      }
    }
  }

  return metadata;
}

function isImageFile(filename: string): boolean {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

async function main() {
  try {
    console.log('Scanning images directory...');
    const metadata = await scanDirectory(IMAGES_DIR);
    
    console.log('Writing metadata file...');
    await writeMetadataFile(metadata);
    
    console.log('✅ Image metadata generated successfully!');
    console.log(`📊 Processed ${metadata.length} images`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
