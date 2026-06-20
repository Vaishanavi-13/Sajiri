# Product Image Update Utility - Setup & Execution Guide

## Overview

This utility automates the process of:
- ✅ Detecting products with missing or placeholder images
- ✅ Assigning relevant fashion images based on category and product name
- ✅ Updating MongoDB with real image URLs from Unsplash
- ✅ Maintaining data integrity (no deletions, only updates)

## Prerequisites

1. **Node.js** installed (v14+)
2. **MongoDB** running and accessible
3. **.env file** configured with `MONGO_URI`
4. Backend dependencies installed (`npm install` in `/backend`)

## Configuration

### 1. Verify MongoDB Connection

Check your `.env` file in the root directory:

```bash
# Example .env
MONGO_URI=mongodb://localhost:27017/sajiri
# or for MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sajiri
JWT_SECRET=your_jwt_secret
PORT=8000
```

### 2. Image Source

The script uses **Unsplash CDN URLs** - a free, high-quality fashion image service:
- No API key required
- CDN-optimized images
- Automatic resizing (400x500 aspect ratio)
- Professional fashion photography

## How the Script Works

### Detection Logic

The script identifies products needing updates based on:

```
Product needs update IF:
  ├─ mainImage is empty/missing
  ├─ image is empty/missing
  ├─ mainImage contains placeholder patterns (via.placeholder, dummyimage, etc.)
  └─ image contains placeholder patterns
```

### Image Assignment Logic

For each product, images are assigned based on:

```
1. Category (Women/Men/Kids)
2. Product name keywords (Saree, Kurta, Dress, Shirt, etc.)
3. Falls back to category default if no specific match found
```

### Category & Product Type Mapping

**Women's Category:**
- Saree → Saree image
- Lehenga → Lehenga image
- Dress → Dress image
- Kurta → Kurta image
- Ethnic Wear → Ethnic wear image
- Default → Women's fashion image

**Men's Category:**
- Shirt → Shirt image
- Kurta → Kurta image
- Jacket → Jacket image
- T-shirt → T-shirt image
- Track Pants → Track pants image
- Default → Men's fashion image

**Kids' Category:**
- Dress → Kids dress image
- T-shirt → Kids T-shirt image
- Track Pants → Track pants image
- Kids wear → Kids wear image
- Ethnic Wear → Kids ethnic wear image
- Default → Kids fashion image

## Execution Steps

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Ensure Dependencies are Installed

```bash
npm install
```

If you see any missing packages, install them:

```bash
npm install mongoose express dotenv
```

### Step 3: Run the Update Script

```bash
node scripts/updateProductImages.js
```

### Step 4: Monitor Output

The script will display:

```
🚀 Starting Product Image Update Utility
==========================================

🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Fetching products...
📊 Total products: 15

✨ Update Summary:
   Total products updated: 12
   Products unchanged: 3

📝 Updated Products:

  1. Classic White Cotton T-Shirt
     Category: Women
     Old mainImage: https://via.placeholder.com/400x400?text=White+T-Shirt+Women
     Old image: (empty)
     New image: https://images.unsplash.com/photo-1558618666-fcd...

  [More products...]

✅ Product images updated successfully!

🔌 Disconnected from MongoDB
```

## Verification

### 1. Check Database Updates

Open MongoDB client and verify:

```javascript
// In MongoDB shell or MongoDB Compass
db.products.find({ mainImage: { $nin: ["", null] } }).count()
// Should show all products with mainImage populated
```

### 2. Test Frontend Display

1. Start the backend: `npm start` (in `/backend`)
2. Start the frontend: `npm start` (in `/frontend`)
3. Navigate to Home page - products should display with real images
4. Check ProductCard component displays images correctly

### 3. Verify No Placeholder URLs

```bash
# Check for remaining placeholder URLs
grep -r "placeholder\|dummyimage\|via.placeholder" backend/seed.data.js
```

## Script Output Files

The script creates:
- **No files** - Only updates MongoDB
- **Console logs** - Shows detailed update information

## Rollback (If Needed)

If you need to revert to placeholder images:

### Option 1: Re-seed the database

```bash
# Delete all products
db.products.deleteMany({})

# Re-seed
node backend/seed.js
```

### Option 2: Update specific products manually

```javascript
// MongoDB shell
db.products.updateOne(
  { _id: ObjectId("...") },
  { $set: { mainImage: "https://via.placeholder.com/..." } }
)
```

## Troubleshooting

### Issue: "MONGO_URI not defined in .env file"

**Solution:** Add `MONGO_URI` to your `.env` file:

```bash
MONGO_URI=mongodb://localhost:27017/sajiri
```

### Issue: "No products found in the database"

**Solution:** Run the seed script first:

```bash
node backend/seed.js
```

### Issue: "Connection refused to MongoDB"

**Solution:** Ensure MongoDB is running:

```bash
# For local MongoDB
mongod

# For MongoDB Atlas, verify connection string in .env
```

### Issue: Script hangs or doesn't complete

**Solution:** 

1. Check MongoDB connection:
```bash
mongo "mongodb://localhost:27017"
```

2. Verify .env variables are correct

3. Check if any products are locked/corrupted:
```bash
# In MongoDB shell
db.products.findOne()
```

## Advanced: Customizing Images

To change the image mapping, edit `backend/scripts/updateProductImages.js`:

```javascript
const FASHION_IMAGES = {
  Women: {
    'Saree': 'YOUR_NEW_IMAGE_URL',
    'Lehenga': 'YOUR_NEW_IMAGE_URL',
    // ... more products
  },
  // ... more categories
};
```

## Performance Considerations

- **Script runtime:** ~2-5 seconds for 15 products
- **Database load:** Minimal (single document updates)
- **Image CDN:** Unsplash handles global distribution

## Security Notes

- ✅ Script only **updates** products, never deletes
- ✅ No authentication required (assumes local/secure MongoDB)
- ✅ Image URLs are public (Unsplash CDN)
- ✅ No sensitive data exposed in logs

## Next Steps

1. ✅ Run the image update script
2. ✅ Verify products display in frontend
3. ✅ Update ProductCard component (already done - uses mainImage || image)
4. ✅ Test product creation/upload with new images
5. ✅ Monitor image loading performance

## Support

For issues with:
- **MongoDB:** Check `.env` and connection status
- **Images:** Verify Unsplash URLs are accessible
- **Script errors:** Check console output for specific error messages
- **Frontend display:** Verify ProductCard component fallback logic

---

**Last Updated:** 2026-06-20  
**Version:** 1.0  
**Tested with:** Node v16+, MongoDB 4.4+, Mongoose 5.11+
