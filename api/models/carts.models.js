const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `carts`');
  return rows;
}

async function getById(cart_id) {
  const [rows] = await pool.query('SELECT * FROM `carts` WHERE `cart_id` = ?', [cart_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `carts` SET ?', [data]);
  return res.insertId;
}

async function update(cart_id, data) {
  const [res] = await pool.query('UPDATE `carts` SET ? WHERE `cart_id` = ?', [data, cart_id]);
  return res.affectedRows;
}

async function remove(cart_id) {
  const [res] = await pool.query('DELETE FROM `carts` WHERE `cart_id` = ?', [cart_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
