const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pool = require("../common/db.js");

// Multer config
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const random = Math.random().toString(36).substring(2, 4);
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}${random}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
});

async function uploadImages(files) {
    const result = {};

    if (!files || !Array.isArray(files)) return result;

    files.forEach(file => {
        if (!result[file.fieldname]) {
            result[file.fieldname] = [];
        }
        result[file.fieldname].push(`/uploads/${file.filename}`);
    });

    return result;
}

async function deleteImage(imagePath) {
    try {
        const fullPath = path.join(__dirname, '../', imagePath);
        await fs.unlink(fullPath);
    } catch (error) {
        console.error('Delete image error:', error);
    }
}

async function deleteProductImages(productId) {
    try {
        // Lấy danh sách ảnh của product và variant từ DB
        const [rows] = await pool.query(`
            select p.product_id, image_url
            from products p left join product_variants v on p.product_id = v.product_id
            left join variant_images vi on vi.variant_id = v.variant_id
            where p.product_id = '${productId}';
        `);
        console.log(rows)

        if (!rows || rows.length === 0) {
            console.log(`Không tìm thấy ảnh nào trong DB cho product ${productId}`);
            return;
        }

        // Đường dẫn thư mục uploads
        const uploadDir = path.join(process.cwd(), "uploads");

        // Duyệt từng ảnh và xóa file tương ứng
        for (const row of rows) {
            if (!row.image_url) continue;

            const filePath = path.join(uploadDir, path.basename(row.image_url));

            try {
                await fs.unlink(filePath);
                console.log(`Đã xóa ảnh: ${filePath}`);
            } catch (err) {
                if (err.code === "ENOENT") {
                    console.warn(`File không tồn tại: ${filePath}`);
                } else {
                    console.error(`Lỗi khi xóa ${filePath}:`, err);
                }
            }
        }
    } catch (error) {
        console.error("Lỗi khi xóa ảnh sản phẩm:", error);
    }
}

module.exports = { upload, uploadImages, deleteImage, deleteProductImages };