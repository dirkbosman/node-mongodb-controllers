# node-mongodb-controllers

A (Destructured) Express Node MongoDB App w. Controllers & Mongoose-ORM integration.

### Summary:

- node express server, middleware and apis
- mongodb non-relational database

### Boilerplates:

- [Part 1: node-postgresql-unstructured](https://github.com/dirkbosman/node-postgresql-unstructured)
- [Part 2: node-postgresql-destructured](https://github.com/dirkbosman/node-postgresql-destructured)
- [Part 3: node-postgresql-controllers](https://github.com/dirkbosman/node-postgresql-controllers)
- [Part 4: node-mongodb-controllers](https://github.com/dirkbosman/node-mongodb-controllers)

### Add Models

```
# models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    maxlength: [50, 'Only max 50 chars are allowed for the name']
  },
  surname: {
    type: String,
    required: [true, 'Please add a surname'],
    maxlength: [50, 'Only max 50 chars are allowed for the surname']
  },
  age: {
    type: Number,
    max: 120
  }
});

module.exports = mongoose.model('User', UserSchema);
```

### Update Controllers

```
# controllers/users.js

const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, msg: 'show all users', data: users })
  } catch(err) {
    next(err)
  }
}

const getUser = (req, res, next) => {

};

const createUser = (req, res, next) => {

};

const deleteUser = (req, res, next) => {

};

const updateUser = (req, res, next) => {

};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
```

Make request:

- This request should show a JSON with data field with all users: http://localhost:3000/users

### Route to "Get A User"

```
const getUser = async (req, res, next) => {
  // 5f4d75a8bf290843cc1e7f96
  const { id } = req.params;
  try {
    const user = await User.find({ _id: id });
    res.json({ success: true, msg: 'show selected user', data: user })
  } catch(err) {
    next(err)
  }
};
```

Make request:

- http://localhost:3000/<ObjectId> should show a JSON with data field with all specific user (i.e. http://localhost:3000/5f4d75a8bf290843cc1e7f96).

### Route to "Create New User"

```
const createUser = async (req, res, next) => {
  try {
    const { name, surname, age } = req.body;
    const user = await User.create({ name, surname, age});

    res.json({ success: true, msg: 'show new user', data: user })
  } catch(err) {
    next(err)
  }
};
```

Terminal:

```
curl -d '{"name": "Jiggly", "surname": "Puff", "age": 100}' -H "Content-Type: application/json" -X POST http://localhost:3000/users

curl -d '{"surname": "Chu", "age": 100}' -H "Content-Type: application/json" -X POST http://localhost:3000/users // prompts error

# Could be denied, because you specified a certain max in your mongoose-schema
curl -d '{"name": "Pika", "surname": "Chu", "age": 140}' -H "Content-Type: application/json" -X POST http://localhost:3000/users
```

### Route to "Update (Existing) User"

```
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, surname, age } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, surname, age }, { new: true });
    res.json({ success: true, msg: 'update users', data: user })
  } catch(err) {
    next(err)
  }
};
```

Terminal:

```
curl -d '{"name": "Pika", "surname": "Chu", "age": 3}' -H "Content-Type: application/json" -X PUT http://localhost:3000/users/5f4f5726ddde594d290c80d1
curl -d '{"name": "Jiggly", "surname": "Puff", "age": 3}' -H "Content-Type: application/json" -X PUT http://localhost:3000/users/5f4f5726ddde594d290c80d1
```

### Route to "Delete (Existing) User"

```
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    res.json({ success: true, msg: `user with id ${id} deleted`, data: user })
  } catch(err) {
    next(err)
  }
};
```

Terminal:

```
curl -X DELETE http://localhost:3000/users/${id}
curl -X DELETE http://localhost:3000/users/5f4d7587bf290843cc1e7f95
```

## Future Suggestions

### One to many mappings between tables:

- You won't have a foreign key in mongoDB, just an entry on the order with the user_id.
- If you want both you'd do another find on orders for specific users, or find all and then connect to users
- Unless you want orders to be part of the users, but I wouldn't go that way
