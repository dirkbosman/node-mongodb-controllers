const db = require('../dbinit');

const getOrders = async (req, res, next) => {
  try {
    const data = await db.query('SELECT * FROM Orders;');
    res.json(data.rows)
  } catch(err) {
    next(err)
  }
}

const getOrder = (req, res, next) => {
  const { id } = req.params;

  db
    .query("SELECT * FROM orders WHERE id=$1;", [id])
    .then(data => res.json(data.rows))
    .catch(e => next(e));
};

const createOrder = (req, res, next) => {
  const { price, user } = req.body;

  db
    .query('INSERT INTO orders(price, user_id) values($1, $2);', [price, user])
    .then(data => res.status(201).json(data))
    .catch(e => next(e));
};

const deleteOrder = (req, res, next) => {
  const { id } = req.params;

  db
    .query('DELETE FROM orders WHERE id=$1;', [id])
    .then(data => res.json(data))
    .catch(e => next(e));
};

const updateOrder = (req, res, next) => {
  const { id } = req.params;
  const { price, user } = req.body;

  db
    .query('UPDATE orders SET price=$1, user_id=$2 WHERE id=$3;', [price, user, id])
    .then(data => res.json(data))
    .catch(e => next(e));
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
}