const pool = require('../common/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM `carts`');
  return rows;
}

async function getById(cart_id) {
  const [rows] = await pool.query(`
    select 
    c.cart_id,
    cart_item_id,
    ci.product_id,
    ci.variant_id,
    quantity,
    ci.name,
    ci.price_snapshot,
    v.thumbnail_url
    from 
    carts c left join cart_items ci on c.cart_id = ci.cart_id
    inner join product_variants v on ci.variant_id = v.variant_id;
    where c.cart_id = ${cart_id}
    `);

  const cart = {
    cart_id: rows[0].cart_id,
    items: rows
      .filter(r => r.cart_item_id)
      .map(({ cart_item_id, product_id, variant_id, name, quantity, price_snapshot, thumbnail_url }) => ({
        cart_item_id,
        product_id,
        variant_id,
        name,
        quantity,
        price_snapshot,
        thumbnail_url
      }))
  };

  return cart;
}

async function create(data) {
  const { user_id } = data;
  
  // Kiểm tra xem user đã có giỏ hàng chưa
  const cartCheck = await db.query('SELECT cart_id FROM carts WHERE user_id = $1', [user_id]);

  if (cartCheck.rows.length > 0) {
    return cartCheck.rows[0].cart_id; 
  }
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
