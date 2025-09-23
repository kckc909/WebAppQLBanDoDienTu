const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const model = require('../models/product_images.models');

// Multer: lưu tạm file
const upload = multer({ dest: 'uploads/tmp' });

// Upload nhiều ảnh
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

        const savedImages = [];

        for (let file of req.files) {
            // 1. Insert DB để lấy image_id
            const imageId = await model.create(product_id);

            // 2. Đặt tên file chuẩn
            const ext = path.extname(file.originalname) || '.jpg';
            const fileName = `${product_id}_${imageId}${ext}`;
            const productDir = path.join('uploads', 'products', product_id.toString());

            if (!fs.existsSync(productDir)) {
                fs.mkdirSync(productDir, { recursive: true });
            }

            const finalPath = path.join(productDir, fileName);

            // 3. Di chuyển file từ tmp -> folder chính
            fs.renameSync(file.path, finalPath);

            // 4. Cập nhật url trong DB
            const url = `/uploads/products/${product_id}/${fileName}`;
            await model.updateImageUrl(imageId, url);

            savedImages.push({ image_id: imageId, product_id, image_url: url });
        }

        res.json(savedImages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Lấy danh sách ảnh của 1 sản phẩm
router.get('/:product_id', async (req, res) => {
    const productId = req.params.product_id;
    const rows = await model.getByProduct(productId);
    res.json(rows);
});

// Xoá ảnh
router.delete('/:image_id', async (req, res) => {
    try {
        const imageId = req.params.image_id;
        const img = await model.remove(imageId);

        if (!img) return res.status(404).json({ error: 'Not found' });

        const filePath = path.join('.', img.image_url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Deleted', image_id: imageId });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});

module.exports = router;
