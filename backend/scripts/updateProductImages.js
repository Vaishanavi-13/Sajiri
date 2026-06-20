/**
 * Product Image Update Utility
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Fetches all products with missing mainImage or image fields
 * 3. Assigns relevant fashion images based on category and product name
 * 4. Updates MongoDB automatically
 * 
 * Usage: node backend/scripts/updateProductImages.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product.model');

// Fashion image mapping by category and product type
// High-quality Unsplash images with 400x500 aspect ratio (perfect for product cards)
const FASHION_IMAGES = {
  Women: {
  'T-Shirt': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
  'Shirt': 'https://images.pexels.com/photos/7691226/pexels-photo-7691226.jpeg',
  'Top': 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg',

  'Dress': 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
  'Floral Dress': 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg',
  'Summer Dress': 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',

  'Saree': 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg',
  'Lehenga': 'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg',
  'Kurta': 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg',
  'Ethnic': 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg',

  'Jeans': 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
  'Leggings': 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg',
  'Pants': 'https://images.pexels.com/photos/6311584/pexels-photo-6311584.jpeg',

  'Yoga': 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg',
  'Activewear': 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg',

  'Hoodie': 'https://images.pexels.com/photos/6311650/pexels-photo-6311650.jpeg',
  'Jacket': 'https://images.pexels.com/photos/6311640/pexels-photo-6311640.jpeg',

  'default': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg'
},

Men: {
  'T-Shirt': 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg',
  'T-shirt': 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg',

  'Shirt': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
  'Formal Shirt': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',

  'Kurta': 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg',

  'Shorts': 'https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg',
  'Sports Shorts': 'https://images.pexels.com/photos/936075/pexels-photo-936075.jpeg',

  'Chinos': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
  'Jeans': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
  'Track Pants': 'https://images.pexels.com/photos/6311663/pexels-photo-6311663.jpeg',
  'Pants': 'https://images.pexels.com/photos/6311663/pexels-photo-6311663.jpeg',

  'Jacket': 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
  'Zip-up Jacket': 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',

  'default': 'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg'
},

Kids: {
  'T-Shirt': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg',
  'T-shirt': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg',
  'Shirt': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg',
  'Colorful': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg',

  'Dress': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
  'Cute Dress': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
  'Pink Dress': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',

  'Shorts': 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg',
  'Denim Shorts': 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg',
  'Track Pants': 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg',
  'Pants': 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg',

  'Hoodie': 'https://images.pexels.com/photos/3770588/pexels-photo-3770588.jpeg',
  'Printed Hoodie': 'https://images.pexels.com/photos/3770588/pexels-photo-3770588.jpeg',

  'Kids wear': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
  'Activewear': 'https://images.pexels.com/photos/3933274/pexels-photo-3933274.jpeg',

  'default': 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg'
}
};

// Placeholder image URL detection
const PLACEHOLDER_PATTERNS = [
  'placeholder',
  'via.placeholder',
  'dummyimage',
  'imgur.com/default',
  'no-image',
  'no_image',
  'default-image',
];

/**
 * Check if a URL is a placeholder
 */
function isPlaceholderImage(url) {
  if (!url || url === '') return true;
  const lowerUrl = url.toLowerCase();
  return PLACEHOLDER_PATTERNS.some(pattern => lowerUrl.includes(pattern));
}

/**
 * Check if a URL is an Unsplash image
 */
function isUnsplashImage(url) {
  if (!url || url === '') return false;
  return url.toLowerCase().includes('images.unsplash.com');
}

/**
 * Get relevant image for a product based on category and name
 * Uses case-insensitive substring matching with longest match first
 */
function getRelevantImage(category, productName, subCategory = '') {
  const normalizedCategory = category && FASHION_IMAGES[category] ? category : 'Women';
  const categoryImages = FASHION_IMAGES[normalizedCategory];
  const searchText = `${productName || ''} ${subCategory || ''}`.toLowerCase();

  let bestMatch = null;
  let bestMatchLength = 0;

  for (const [key, imageUrl] of Object.entries(categoryImages)) {
    if (key === 'default') continue;
    const lowerKey = key.toLowerCase();
    if (searchText.includes(lowerKey) && lowerKey.length > bestMatchLength) {
      bestMatch = imageUrl;
      bestMatchLength = lowerKey.length;
    }
  }

  return bestMatch || categoryImages.default;
}

/**
 * Check if a product needs image update
 */
function needsImageUpdate(product) {
  const mainImageMissing = !product.mainImage || product.mainImage.trim() === '';
  const imageMissing = !product.image || product.image.trim() === '';
  const mainImagePlaceholder = isPlaceholderImage(product.mainImage);
  const imagePlaceholder = isPlaceholderImage(product.image);
  const mainImageUnsplash = isUnsplashImage(product.mainImage);
  const imageUnsplash = isUnsplashImage(product.image);

  return (
    mainImageMissing ||
    imageMissing ||
    mainImagePlaceholder ||
    imagePlaceholder ||
    mainImageUnsplash ||
    imageUnsplash
  );
}

/**
 * Main update function
 */
async function updateProductImages() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not defined in .env file');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Fetch all products
    console.log('\n📦 Fetching products...');
    const products = await Product.find({});
    console.log(`📊 Total products: ${products.length}`);

    if (products.length === 0) {
      console.log('⚠️  No products found in the database');
      await mongoose.disconnect();
      return;
    }

    // Identify products needing updates
    let updatedCount = 0;
    const updates = [];

    for (const product of products) {
      if (needsImageUpdate(product)) {
        const relevantImage = getRelevantImage(product.category, product.name || '', product.subCategory || '');
        
        updates.push({
          productId: product._id,
          name: product.name,
          category: product.category,
          oldMainImage: product.mainImage || '(empty)',
          oldImage: product.image || '(empty)',
          newImage: relevantImage,
        });

        // Update the product
        product.mainImage = relevantImage;
        product.image = relevantImage;
        await product.save();
        updatedCount++;
      }
    }

    // Print results
    console.log(`\n✨ Update Summary:`);
    console.log(`   Total products updated: ${updatedCount}`);
    console.log(`   Products unchanged: ${products.length - updatedCount}`);

    if (updates.length > 0) {
      console.log('\n📝 Updated Products:');
      updates.forEach((update, idx) => {
        console.log(`\n  ${idx + 1}. ${update.name}`);
        console.log(`     Category: ${update.category}`);
        console.log(`     Old mainImage: ${update.oldMainImage}`);
        console.log(`     Old image: ${update.oldImage}`);
        console.log(`     New image: ${update.newImage.substring(0, 60)}...`);
      });
    }

    console.log('\n✅ Product images updated successfully!');
    
  } catch (err) {
    console.error('❌ Error updating product images:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the update
console.log('🚀 Starting Product Image Update Utility');
console.log('==========================================\n');
updateProductImages();
