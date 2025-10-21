
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();


app.use(cors());
app.use(bodyParser.json());

// --- ROUTES IMPORTS START ---
const productImagesRoute = require('./routes/product_images.routes');
const couponsRoute = require('./routes/coupons.routes');
const bannersRoute = require('./routes/banners.routes');
const addressesRoute = require('./routes/addresses.routes');
const usersRoute = require('./routes/users.routes');
const reviewsRoute = require('./routes/reviews.routes');
const productsRoute = require('./routes/products.routes');
const ordersRoute = require('./routes/orders.routes');
const orderItemsRoute = require('./routes/order_items.routes');
const categoriesRoute = require('./routes/categories.routes');
const cartsRoute = require('./routes/carts.routes');
const cartItemsRoute = require('./routes/cart_items.routes');
const checkout = require('./routes/checkout.routes');
// --- ROUTES IMPORTS END ---

// --- ROUTES USE START ---
app.use('/api/product_images', productImagesRoute);
app.use('/api/coupons', couponsRoute);
app.use('/api/banners', bannersRoute);
app.use('/api/addresses', addressesRoute);
app.use('/api/users', usersRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/order_items', orderItemsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/cart_items', cartItemsRoute);
app.use('/api/checkout', checkout)
// --- ROUTES USE END ---

// Xử lý ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// run server
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}/api/`));

module.exports = app;
