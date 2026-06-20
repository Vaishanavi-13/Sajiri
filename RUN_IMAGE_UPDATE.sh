#!/bin/bash
# Product Image Update - One-Click Execution Script
# Usage: Copy commands below and run in terminal

echo "🚀 Sajiri Product Image Update - Start Here"
echo "==========================================="
echo ""

# Step 1
echo "Step 1: Navigate to backend directory..."
cd backend
echo "✅ In backend directory"
echo ""

# Step 2
echo "Step 2: Verify MongoDB is running..."
echo "Make sure MongoDB daemon is started (mongod should be running)"
echo ""

# Step 3
echo "Step 3: Run the image update script..."
echo "Command: node scripts/updateProductImages.js"
echo ""
echo "⏳ Waiting for you to run the command above..."
echo ""

# Instructions
cat << 'EOF'
STEP-BY-STEP INSTRUCTIONS:

1. Open Terminal/PowerShell in your Sajiri project root

2. Copy and paste this:
   cd backend && node scripts/updateProductImages.js

3. You should see output like:
   🚀 Starting Product Image Update Utility
   🔌 Connecting to MongoDB...
   ✅ Connected to MongoDB
   📦 Fetching products...
   📊 Total products: 15
   ✨ Update Summary:
      Total products updated: 15
   ✅ Product images updated successfully!

4. If successful, start the project:
   Terminal 1: npm start (in backend folder)
   Terminal 2: npm start (in frontend folder)

5. Open browser: http://localhost:3000
   You should see beautiful fashion images on all products!

TROUBLESHOOTING:

If "MONGO_URI not defined":
   → Add MONGO_URI to .env file
   → Check MongoDB is running

If "No products found":
   → Run: node seed.js
   → Then run the image script again

If MongoDB connection error:
   → Start MongoDB: mongod
   → Verify connection in .env

NEXT STEPS AFTER SUCCESS:

1. ✅ Test the homepage - products should have images
2. ✅ Navigate through categories - verify proper images assigned
3. ✅ Create a new product - test upload functionality
4. ✅ Review database - check mainImage and image fields populated

That's it! Your product catalog now has beautiful images! 🎉
EOF
