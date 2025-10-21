const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/products.controllers');
const { upload } = require('../utils/imageHandle');

// GET /api/<table>
router.get('/', ctrl.getAll);
router.get('/search', ctrl.get_product_search);
router.get('/detail/:id', ctrl.get_product_detail);
router.get('/list', ctrl.get_product_list)
router.get('/test', ctrl.api_test);
router.get('/:id', ctrl.getById);

router.post('/', upload.any(), ctrl.create);

router.put('/:id', upload.any(), ctrl.update);

router.delete('/:id', ctrl.remove);

module.exports = router;
