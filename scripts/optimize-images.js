const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const REGIONAL_DIR = '../public/images/regional';
const SPONSORS_DIR = '../public/images/sponsors';
const OUTPUT_SIZES = {
  regional: {
    width: 1200,
    height: 800,
  },
  mission: {
    width: 800,
    height: 600,
  },
  sponsors: {
    width: 200,
    height: 80,
  },
};

async function optimizeImage(inputPath, outputPath, options) {
  try {
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toFile(outputPath + '.webp');

    // Create a JPG fallback
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath + '.jpg');

    console.log(`✅ Optimized: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error);
  }
}

async function processDirectory(directory, sizeConfig) {
  try {
    const files = await fs.readdir(directory);
    
    for (const file of files) {
      if (file === '.gitkeep' || file === 'README.md') continue;
      
      const inputPath = path.join(directory, file);
      const stats = await fs.stat(inputPath);
      
      if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
        const filename = path.parse(file).name;
        const outputPath = path.join(
          directory,
          'optimized',
          filename
        );
        
        await fs.mkdir(path.join(directory, 'optimized'), { recursive: true });
        await optimizeImage(inputPath, outputPath, sizeConfig);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

async function main() {
  try {
    // Process regional backgrounds
    await processDirectory(
      path.join(__dirname, REGIONAL_DIR),
      OUTPUT_SIZES.regional
    );

    // Process mission images
    await processDirectory(
      path.join(__dirname, REGIONAL_DIR, 'mission'),
      OUTPUT_SIZES.mission
    );

    // Process sponsor logos
    await processDirectory(
      path.join(__dirname, SPONSORS_DIR),
      OUTPUT_SIZES.sponsors
    );

    console.log('✨ Image optimization complete!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
