const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `coupons`');
  return rows;
}

async function getById(coupon_id) {
  const [rows] = await pool.query('SELECT * FROM `coupons` WHERE `coupon_id` = ?', [coupon_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `coupons` SET ?', [data]);
  return res.insertId;
}

async function update(coupon_id, data) {
  const [res] = await pool.query('UPDATE `coupons` SET ? WHERE `coupon_id` = ?', [data, coupon_id]);
  return res.affectedRows;
}

async function remove(coupon_id) {
  const [res] = await pool.query('DELETE FROM `coupons` WHERE `coupon_id` = ?', [coupon_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
