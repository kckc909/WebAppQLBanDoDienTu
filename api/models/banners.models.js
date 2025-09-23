const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `banners`');
  return rows;
}

async function getById(banner_id) {
  const [rows] = await pool.query('SELECT * FROM `banners` WHERE `banner_id` = ?', [banner_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `banners` SET ?', [data]);
  return res.insertId;
}

async function update(banner_id, data) {
  const [res] = await pool.query('UPDATE `banners` SET ? WHERE `banner_id` = ?', [data, banner_id]);
  return res.affectedRows;
}

async function remove(banner_id) {
  const [res] = await pool.query('DELETE FROM `banners` WHERE `banner_id` = ?', [banner_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
