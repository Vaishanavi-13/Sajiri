# 🚀 Quick Start - Product Image Update

## Prerequisites Checklist

- [x] Node.js v14+ installed
- [x] Backend dependencies: `npm install` (in `/backend`)
- [x] MongoDB running
- [x] `.env` file configured with `MONGO_URI`

## One-Command Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Run the image update script
node scripts/updateProductImages.js
```

## What Gets Updated

| Field | Before | After |
|-------|--------|-------|
| `mainImage` | `https://via.placeholder.com/...` | Real Unsplash fashion image |
| `image` | Empty or placeholder | Real Unsplash fashion image |

## Image Assignment Examples

### Women's Category
- Product: **"Classic White Cotton T-Shirt"** → Women's T-Shirt image
- Product: **"Floral Summer Dress"** → Women's Dress image
- Product: **"Red Hoodie Sweatshirt"** → Women's Hoodie image

### Men's Category
- Product: **"Navy Blue Formal Shirt"** → Men's Formal Shirt image
- Product: **"Dark Blue Chinos"** → Men's Pants image
- Product: **"Gray Zip-up Jacket"** → Men's Jacket image

### Kids' Category
- Product: **"Colorful Kids T-Shirt"** → Kids' T-Shirt image
- Product: **"Pink Cute Dress"** → Kids' Dress image
- Product: **"Sports Track Pants"** → Kids' Track Pants image

## Verification

### Check in Frontend
1. Start backend: `npm start` (in `/backend`)
2. Start frontend: `npm start` (in `/frontend`)
3. Navigate to **Home** page
4. Verify products display with real fashion images

### Check in Database
```bash
# Using MongoDB CLI
mongo
use sajiri
db.products.findOne({ name: "Classic White Cotton T-Shirt" })

# Should show mainImage with Unsplash URL
```

## Troubleshooting

### ❌ "MONGO_URI not defined"
Add to `.env`:
```
MONGO_URI=mongodb://localhost:27017/sajiri
```

### ❌ "No products found"
Seed first:
```bash
node backend/seed.js
```

### ❌ "Connection refused"
Ensure MongoDB is running:
```bash
mongod
```

## Output Example

```
🚀 Starting Product Image Update Utility
==========================================

🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📦 Fetching products...
📊 Total products: 15

✨ Update Summary:
   Total products updated: 15
   Products unchanged: 0

✅ Product images updated successfully!
```

## Next Steps

1. ✅ **Run script** → Updates MongoDB with real images
2. ✅ **Start frontend** → Products display with beautiful images
3. ✅ **Test product creation** → New uploads use the same image logic
4. ✅ **Monitor** → Verify all products display correctly

## Pro Tips

- **Customize images:** Edit `/backend/scripts/updateProductImages.js` FASHION_IMAGES object
- **Add new categories:** Follow the same pattern in FASHION_IMAGES
- **No data loss:** Script only updates images, never deletes products
- **Safe to run multiple times:** Won't create duplicates, just updates

## Technical Details

- **Image source:** Unsplash CDN (free, high-quality)
- **Image size:** 400x500px (optimized for product cards)
- **Database:** MongoDB only, no API calls
- **Runtime:** ~2-5 seconds for 15 products

---

For detailed setup guide, see [README.md](./README.md)
