@echo off
REM Product Image Update - Windows Batch Script
REM Usage: Double-click this file or run: RUN_IMAGE_UPDATE.bat

echo.
echo 🚀 Sajiri Product Image Update - Windows Guide
echo ================================================
echo.

REM Step 1
echo Step 1: Checking directory structure...
if not exist "backend" (
    echo ❌ Error: backend folder not found!
    echo Please run this script from the Sajiri project root directory
    pause
    exit /b 1
)
echo ✅ Backend directory found
echo.

REM Step 2
echo Step 2: Navigate to backend...
cd backend
echo ✅ Now in backend directory
echo.

REM Step 3
echo Step 3: Prerequisites checklist
echo ================================
echo.
echo Before running the image update, ensure:
echo   [ ] MongoDB is running (mongod)
echo   [ ] .env file exists with MONGO_URI
echo   [ ] Node modules installed (npm install done)
echo.

REM Step 4
echo Step 4: Ready to run image update script
echo ==========================================
echo.
echo Copy and paste this command into PowerShell/CMD:
echo.
echo   node scripts/updateProductImages.js
echo.
echo Then press Enter to run it.
echo.

REM Show what to expect
echo Expected Output:
echo ================
echo 🚀 Starting Product Image Update Utility
echo 🔌 Connecting to MongoDB...
echo ✅ Connected to MongoDB
echo 📦 Fetching products...
echo 📊 Total products: [number]
echo ✨ Update Summary:
echo    Total products updated: [number]
echo ✅ Product images updated successfully!
echo.

REM Pause to show message
echo Press any key to continue...
pause

REM Run the script
echo.
echo Running: node scripts/updateProductImages.js
echo.
node scripts/updateProductImages.js

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Product images have been updated!
    echo.
    echo Next Steps:
    echo 1. Start backend: npm start
    echo 2. Open another terminal and start frontend: npm start
    echo 3. Open http://localhost:3000 in your browser
    echo 4. Verify products display with images
    echo.
) else (
    echo.
    echo ❌ Script failed with error code %ERRORLEVEL%
    echo.
    echo Troubleshooting:
    echo - Ensure MongoDB is running: mongod
    echo - Check .env has MONGO_URI configured
    echo - Verify backend/node_modules exists
    echo - Try running: npm install
    echo.
)

pause
