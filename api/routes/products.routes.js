const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/products.controllers');

// GET /api/<table>
router.get('/search', ctrl.get_product_search);
router.get('/detail/:id', ctrl.get_product_detail);
router.get('/list', ctrl.get_product_list)

router.get('/test', ctrl.api_test);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
