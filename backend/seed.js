const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.model');
const Product = require('./models/Product.model');

dotenv.config();

const products = [];
const picsum = (seed) => `https://picsum.photos/seed/${seed}/400/500`;

const createProducts = () => {
  const items = [];
  // 8 Women Sarees
  for (let i=1;i<=8;i++){
    items.push({
      name: `Silk Saree ${i}`,
      description: `Elegant silk saree number ${i}`,
      price: 2500 + i*200,
      discountPrice: 2000 + i*150,
      category: 'Women',
      subCategory: 'Sarees',
      brand: 'Sajiri',
      stock: 10 + i,
      images: [{ url: picsum('saree'+i), publicId: '' }],
      fabric: 'Silk',
      color: 'Multicolor',
      isFeatured: i<=4
    });
  }
  // 6 Men
  const menCats = ['Shirts','Kurtas','T-Shirts','Trousers'];
  for (let i=1;i<=6;i++){
    items.push({
      name: `Men ${menCats[i%menCats.length]} ${i}`,
      description: `Men's ${menCats[i%menCats.length]} number ${i}`,
      price: 1200 + i*100,
      category: 'Men',
      subCategory: menCats[i%menCats.length],
      brand: 'Sajiri',
      stock: 15,
      images: [{ url: picsum('men'+i), publicId: '' }],
      fabric: 'Cotton',
    });
  }
  // 6 Kids
  const kidsCats = ['Frocks','Boys Wear','Infants'];
  for (let i=1;i<=6;i++){
    items.push({
      name: `Kids ${kidsCats[i%kidsCats.length]} ${i}`,
      description: `Kids ${kidsCats[i%kidsCats.length]} ${i}`,
      price: 800 + i*50,
      category: 'Kids',
      subCategory: kidsCats[i%kidsCats.length],
      brand: 'Sajiri Kids',
      stock: 20,
      images: [{ url: picsum('kids'+i), publicId: '' }],
      fabric: 'Cotton',
    });
  }
  return items;
}

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('Connected to DB');
  await User.deleteMany();
  await Product.deleteMany();

  const admin = new User({ firstName: 'Admin', lastName: 'User', email: 'admin@sajiri.com', password: 'Admin@123', role: 'admin', isVerified: true });
  // hash admin password
  const bcrypt = require('bcryptjs');
  admin.password = await bcrypt.hash('Admin@123', 10);
  await admin.save();

  const u1 = new User({ firstName: 'Test', lastName: 'One', email: 'test1@sajiri.com', password: await require('bcryptjs').hash('Test@1234',10), isVerified: true });
  const u2 = new User({ firstName: 'Test', lastName: 'Two', email: 'test2@sajiri.com', password: await require('bcryptjs').hash('Test@1234',10), isVerified: true });
  await u1.save(); await u2.save();

  const prodItems = createProducts();
  for (const p of prodItems) await Product.create(p);

  console.log('Seeded DB with admin and products');
  process.exit(0);
}

seed().catch(err=>{console.error(err);process.exit(1)});
