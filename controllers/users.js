const db = require('../dbinit');

const getUsers = async (req, res, next) => {
  try {
    const data = await db.query('SELECT * FROM users;');
    res.json(data.rows)
  } catch(err) {
    next(err)
  }
}

const getUser = (req, res, next) => {
  const { id } = req.params;

  db
    .query("SELECT * FROM users WHERE id=$1;", [id])
    .then(data => res.json(data.rows))
    .catch(e => next(e));
};

const createUser = (req, res, next) => {
  const { name, surname, age } = req.body;

  db
    .query('INSERT INTO users(first_name, last_name, age) values($1, $2, $3);', [name, surname, age])
    .then(data => res.status(201).json(data))
    .catch(e => next(e));
};

const deleteUser = (req, res, next) => {
  const { id } = req.params;

  db
    .query('DELETE FROM users WHERE id=$1;', [id])
    .then(data => res.json(data))
    .catch(e => next(e));
};

const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { name, surname, age } = req.body;

  db
    .query('UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4;', [name, surname, age, id])
    .then(data => res.json(data))
    .catch(e => next(e));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}