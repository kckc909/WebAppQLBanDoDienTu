const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `addresses`');
  return rows;
}

async function getById(address_id) {
  const [rows] = await pool.query('SELECT * FROM `addresses` WHERE `address_id` = ?', [address_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `addresses` SET ?', [data]);
  return res.insertId;
}

async function update(address_id, data) {
  const [res] = await pool.query('UPDATE `addresses` SET ? WHERE `address_id` = ?', [data, address_id]);
  return res.affectedRows;
}

async function remove(address_id) {
  const [res] = await pool.query('DELETE FROM `addresses` WHERE `address_id` = ?', [address_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
