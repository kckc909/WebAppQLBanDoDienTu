// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkout.controllers');

router.post('/test', CheckoutController.test);

router.post('/data', CheckoutController.getCheckoutData);

router.post('/check-stock', CheckoutController.checkStock);

router.post('/create-order', CheckoutController.createOrder);

router.post('/add-address', CheckoutController.addAddress);

router.patch('/admin/orders/:order_id/complete', CheckoutController.completeOrder);

module.exports = router;