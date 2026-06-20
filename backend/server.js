const express = require('express');
const path = require('path');
require("dotenv").config();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001','http://localhost:5173'], credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const seedOwnerAccount = async () => {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  const ownerName = process.env.OWNER_NAME?.trim() || 'Sajiri Owner';
  if (!ownerEmail || !ownerPassword) {
    console.log('⚠️ OWNER_EMAIL and OWNER_PASSWORD not configured; owner account will not be seeded.');
    return;
  }

  try {
    const User = require('./models/User.model');
    const existing = await User.findOne({ email: ownerEmail });
    const [firstName = '', lastName = ''] = ownerName.split(' ');
    const hashed = await bcrypt.hash(ownerPassword, 10);

    if (!existing) {
      await User.create({
        name: ownerName,
        firstName,
        lastName,
        email: ownerEmail,
        password: hashed,
        role: 'owner',
        isVerified: true,
      });
      console.log(`✅ Seeded owner user: ${ownerEmail}`);
      return;
    }

    let updated = false;
    if (existing.role !== 'owner') {
      existing.role = 'owner';
      updated = true;
    }
    const passwordMatches = await bcrypt.compare(ownerPassword, existing.password);
    if (!passwordMatches) {
      existing.password = hashed;
      updated = true;
    }
    if (updated) {
      await existing.save();
      console.log(`✅ Updated owner account credentials for ${ownerEmail}`);
    } else {
      console.log(`✓ Owner account already exists: ${ownerEmail}`);
    }
  } catch (err) {
    console.error('❌ Owner account seeding error:', err.message);
  }
};

// Auto-seed sample products on startup
const seedProducts = async () => {
  try {
    const Product = require('./models/Product.model');
    const existingCount = await Product.countDocuments();
    
    if (existingCount === 0) {
      const sampleProducts = require('./seed.data');
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products seeded successfully!');
    } else {
      console.log(`✓ Database already has ${existingCount} products`);
    }
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  }
};

// Seed products and owner account after DB connection
connectDB().then(() => {
  seedProducts();
  seedOwnerAccount();
});

app.get('/', (req, res) => res.send('Sajiri API running'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes') );
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payment', require('./routes/payment'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
