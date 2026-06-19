# Sajiri — Setup Instructions

1. Install global deps (root):

```bash
cd c:\Users\vaish\OneDrive\Desktop\Sajiri
npm install
```

2. Backend:

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values: MONGO_URI (use sajiri DB), JWT_SECRET, JWT_REFRESH_SECRET, JWT_EMAIL_SECRET, FRONTEND_URL, CLOUDINARY_*, RAZORPAY_*, EMAIL_*
```

3. Frontend:

```bash
cd frontend
npm install
# Ensure .env has REACT_APP_API (e.g. http://localhost:8000)
```

4. Seed database (creates admin and sample products):

```bash
npm run seed
```

5. Run dev servers:

```bash
npm run dev
```

6. Login as admin:

- Email: admin@sajiri.com
- Password: Admin@123

Notes:
- Use your MongoDB Atlas connection string in `MONGO_URI` (replace `<user>`, `<password>`, `<cluster>`) — the database name should be **sajiri**.
- CORS is configured to allow `http://localhost:5173` and `http://localhost:3000`.
- Razorpay integration uses test keys; replace with live keys for production.
- Cloudinary uploads go to `sajiri/products` and `sajiri/profiles` folders.
- API error/success format: `{ success: false, message: '...' }` or `{ success: true, data: ... }`.
