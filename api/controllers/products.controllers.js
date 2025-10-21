const model = require('../models/products.models');
const { VariantImage } = require('../models/variant_images');
const imgHandle = require('../utils/imageHandle')
const { ProductVariant } = require('../models/product_variants');

async function getAll(req, res) {
	try {
		const { search, category_id, is_active, page, limit } = req.query;
		const products = await model.findAll({ search, category_id, is_active, page, limit });
		res.json(products);
	} catch (error) {
		console.error('Get products error:', error);
		res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
	}
}

async function getById(req, res) {
	try {
		const product = await model.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
		}
		res.json(product);
	} catch (error) {
		console.error('Get product error:', error);
		res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm' });
	}
}

async function create(req, res) {
	try {
		const { name,
			slug,
			short_description,
			description,
			brand,
			category_id,
			is_active,
			variants,
			product_attributes } = req.body;
		const variantsData = JSON.parse(variants);
		const productAttrs = JSON.parse(product_attributes || '{}');

		// Upload images
		const uploadedImages = await imgHandle.uploadImages(req.files);

		// Get thumbnail
		const thumbnail_url = uploadedImages.variant_0_image_0 ? uploadedImages.variant_0_image_0[0] : null;

		// Create product
		const product_id = await model.create({
			name,
			slug,
			short_description,
			description,
			brand,
			category_id: parseInt(category_id),
			thumbnail_url,
			product_attributes: productAttrs,
			is_active: is_active === '1'
		});

		// Tạo các phiên bản
		for (let i = 0; i < variantsData.length; i++) {
			const variantData = variantsData[i];
			const variantImages = [];

			for (let j = 0; j < variantData.imageCount; j++) {
				const key = `variant_${i}_image_${j}`;
				if (uploadedImages[key]) {
					variantImages.push({
						image_url: uploadedImages[key][0],
						alt_text: variantData.name
					});
				}
			}

			const variant_thumbnail = variantImages[0]?.image_url || null;

			const variant_id = await ProductVariant.create(product_id, {
				...variantData,
				thumbnail_url: variant_thumbnail,
				variant_attributes: variantData.variant_attributes || {}
			});

			await VariantImage.createMany(variant_id, variantImages);
		}

		res.json({ product_id, message: 'Tạo sản phẩm thành công' });
	} catch (error) {
		console.error('Create product error:', error);
		res.status(500).json({ error: 'Lỗi khi tạo sản phẩm' });
	}
}

async function update(req, res) {
	try {
		const product_id = req.params.id;
		const { name, slug, short_description, description, brand, category_id, is_active, variants, product_attributes } = req.body;
		const variantsData = JSON.parse(variants);
		const productAttrs = JSON.parse(product_attributes || '{}');

		// Upload new images
		const uploadedImages = await imgHandle.uploadImages(req.files);

		let thumbnail_url = req.body.thumbnail_url;
		if (uploadedImages.variant_0_image_0) {
			thumbnail_url = uploadedImages.variant_0_image_0[0];
		}

		// Update product
		await model.update(product_id, {
			name,
			slug,
			short_description,
			description,
			brand,
			category_id: parseInt(category_id),
			thumbnail_url,
			product_attributes: JSON.stringify(productAttrs),
			is_active: is_active === '1'
		});

		// Update variants
		for (let i = 0; i < variantsData.length; i++) {
			const variantData = variantsData[i];
			const variantImages = [];

			for (let j = 0; j < variantData.imageCount; j++) {
				const key = `variant_${i}_image_${j}`;
				if (uploadedImages[key]) {
					variantImages.push({
						image_url: uploadedImages[key][0],
						alt_text: variantData.name
					});
				}
			}

			if (variantData.variant_id) {
				const variant_thumbnail = variantImages[0]?.image_url || variantData.thumbnail_url;
				await ProductVariant.update(variantData.variant_id, {
					...variantData,
					thumbnail_url: variant_thumbnail,
					variant_attributes: variantData.variant_attributes || {}
				});

				if (variantImages.length > 0) {
					await VariantImage.deleteByVariantId(variantData.variant_id);
					await VariantImage.createMany(variantData.variant_id, variantImages);
				}
			} else {
				const variant_thumbnail = variantImages[0]?.image_url || null;
				const variant_id = await ProductVariant.create(product_id, {
					...variantData,
					thumbnail_url: variant_thumbnail,
					variant_attributes: variantData.variant_attributes || {}
				});
				await VariantImage.createMany(variant_id, variantImages);
			}
		}

		res.json({ message: 'Cập nhật sản phẩm thành công' });
	} catch (error) {
		console.error('Update product error:', error);
		res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
	}
}

async function remove(req, res) {
	try {
		const { hard_delete } = req.query;

		if (hard_delete === 'true') {
			await model.remove(req.params.id);
			res.json({ message: 'Xóa sản phẩm thành công' });
		} else {
			await model.softDelete(req.params.id);
			res.json({ message: 'Vô hiệu hóa sản phẩm thành công' });
		}
	} catch (error) {
		console.error('Delete product error:', error);
		res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
	}
}

async function get_product_detail(req, res) {
	try {
		const product = await model.get_product_detail(req.params.id);
		if (!product) return res.status(404).json({ error: "Not found" });
		res.json(product);
	}
	catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

async function get_product_search(req, res) {
	try {
		const limit = parseInt(req.query.limit) || 20;
		const offset = parseInt(req.query.offset) || 0;
		const keyword = req.query.keyword || "";
		console.log(limit, offset, keyword)
		const rows = await model.get_product_search(limit, offset, keyword);
		console.log("Kết quả trả về : " + rows[0])
		res.json(rows);
	}
	catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

async function get_product_list(req, res) {

	try {
		const limit = parseInt(req.query.limit) || 10
		const offset = parseInt(req.query.offset) || 0

		const rows = await model.get_product_list(limit, offset);
		res.json(rows);

	}
	catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

module.exports = { getAll, getById, create, update, remove, get_product_detail, get_product_search, get_product_list, api_test };

async function api_test() {
	console.log("Đã chạy thành công")
	return 'Đã chạy thành công'
}

