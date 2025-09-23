const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `users`');
  return rows;
}

async function getById(user_id) {
  const [rows] = await pool.query('SELECT * FROM `users` WHERE `user_id` = ?', [user_id]);
  return rows[0];
}

async function create(data) {
  const [res] = await pool.query('INSERT INTO `users` SET ?', [data]);
  return res.insertId;
}

async function update(user_id, data) {
  const [res] = await pool.query('UPDATE `users` SET ? WHERE `user_id` = ?', [data, user_id]);
  return res.affectedRows;
}

async function remove(user_id) {
  const [res] = await pool.query('DELETE FROM `users` WHERE `user_id` = ?', [user_id]);
  return res.affectedRows;
}

async function login(email, password) {
  const [rows] = await pool.query('SELECT user_id, fullname, email, role, avatar_url FROM `users` WHERE `email` = ? AND `password` = ?', [email, password]);
  return rows[0];
}

module.exports = { getAll, getById, create, update, remove, login };
