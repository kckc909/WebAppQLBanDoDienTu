const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `products`');
  return rows;
}

async function getById(product_id) {
  const [rows] = await pool.query('SELECT * FROM `products` WHERE `product_id` = ?', [product_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `products` SET ?', [data]);
  return res.insertId;
}

async function update(product_id, data) {
  const [res] = await pool.query('UPDATE `products` SET ? WHERE `product_id` = ?', [data, product_id]);
  return res.affectedRows;
}

async function remove(product_id) {
  const [res] = await pool.query('DELETE FROM `products` WHERE `product_id` = ?', [product_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
