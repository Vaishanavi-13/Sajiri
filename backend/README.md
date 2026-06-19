Sajiri Backend

Quick start:

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`.
3. Run in dev: `npm run dev`.

Endpoints:
- `GET /` - health
- `POST /api/auth/register` - register
- `POST /api/auth/login` - login
- `GET /api/products` - list products
- `POST /api/products` - create product (admin)
- `POST /api/upload` - upload image (base64 payload)
- `POST /api/payment/order` - create Razorpay order

