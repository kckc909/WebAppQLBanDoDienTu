const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `reviews`');
  return rows;
}

async function getById(review_id) {
  const [rows] = await pool.query('SELECT * FROM `reviews` WHERE `review_id` = ?', [review_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `reviews` SET ?', [data]);
  return res.insertId;
}

async function update(review_id, data) {
  const [res] = await pool.query('UPDATE `reviews` SET ? WHERE `review_id` = ?', [data, review_id]);
  return res.affectedRows;
}

async function remove(review_id) {
  const [res] = await pool.query('DELETE FROM `reviews` WHERE `review_id` = ?', [review_id]);
  return res.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
