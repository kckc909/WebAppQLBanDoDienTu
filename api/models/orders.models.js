const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `orders`');
  return rows;
}

async function getById(order_id) {
  const [rows] = await pool.query('SELECT * FROM `orders` WHERE `order_id` = ?', [order_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `orders` SET ?', [data]);
  return res.insertId;
}

async function update(order_id, data) {
  const [res] = await pool.query('UPDATE `orders` SET ? WHERE `order_id` = ?', [data, order_id]);
  return res.affectedRows;
}

async function remove(order_id) {
  const [res] = await pool.query('DELETE FROM `orders` WHERE `order_id` = ?', [order_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
