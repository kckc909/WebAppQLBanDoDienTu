const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `cart_items`');
  return rows;
}

async function getById(cart_item_id) {
  const [rows] = await pool.query('SELECT * FROM `cart_items` WHERE `cart_item_id` = ?', [cart_item_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `cart_items` SET ?', [data]);
  return res.insertId;
}

async function update(cart_item_id, data) {
  const [res] = await pool.query('UPDATE `cart_items` SET ? WHERE `cart_item_id` = ?', [data, cart_item_id]);
  return res.affectedRows;
}

async function remove(cart_item_id) {
  const [res] = await pool.query('DELETE FROM `cart_items` WHERE `cart_item_id` = ?', [cart_item_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
