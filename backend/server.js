const express = require('express');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000','http://localhost:5173'], credentials: true }));

connectDB();

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
