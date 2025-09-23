const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `categories`');
  return rows;
}

async function getById(category_id) {
  const [rows] = await pool.query('SELECT * FROM `categories` WHERE `category_id` = ?', [category_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `categories` SET ?', [data]);
  return res.insertId;
}

async function update(category_id, data) {
  const [res] = await pool.query('UPDATE `categories` SET ? WHERE `category_id` = ?', [data, category_id]);
  return res.affectedRows;
}

async function remove(category_id) {
  const [res] = await pool.query('DELETE FROM `categories` WHERE `category_id` = ?', [category_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
