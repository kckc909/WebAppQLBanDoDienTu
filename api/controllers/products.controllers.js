const model = require('../models/products.models');

async function getAll(req, res) {
	try {
		const rows = await model.getAll();
		res.json(rows);
	} catch (err) {
		console.error(err); res.status(500).json({ error: err.message });
	}
}

async function getById(req, res) {
	try {
		const row = await model.getById(req.params.id);
		if (!row) return res.status(404).json({});
		res.json(row);
	} catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

async function create(req, res) {
	try {
		const id = await model.create(req.body);
		res.json({ id });
	} catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

async function update(req, res) {
	try {
		const r = await model.update(req.params.id, req.body);
		res.json({ affected: r });
	} catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
}

async function remove(req, res) {
	try {
		const r = await model.remove(req.params.id);
		res.json({ affected: r });
	} catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
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



async function api_test() {
	console.log("Đã chạy thành công")
	return 'Đã chạy thành công'
}

module.exports = { getAll, getById, create, update, remove, get_product_detail, get_product_search, get_product_list, api_test };
