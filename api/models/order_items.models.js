const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `order_items`');
  return rows;
}

async function getById(order_item_id) {
  const [rows] = await pool.query('SELECT * FROM `order_items` WHERE `order_item_id` = ?', [order_item_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `order_items` SET ?', [data]);
  return res.insertId;
}

async function update(order_item_id, data) {
  const [res] = await pool.query('UPDATE `order_items` SET ? WHERE `order_item_id` = ?', [data, order_item_id]);
  return res.affectedRows;
}

async function remove(order_item_id) {
  const [res] = await pool.query('DELETE FROM `order_items` WHERE `order_item_id` = ?', [order_item_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
