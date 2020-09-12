# node-mongodb-controllers

A (Destructured) Express Node MongoDB App w. Controllers & Mongoose-ORM integration.

### Summary:

- node express server, middleware and apis
- mongodb non-relational database

### Boilerplates:

- [Part 1: node-postgresql-unstructured](https://github.com/dirkbosman/node-postgresql-unstructured)
- [Part 2: node-postgresql-destructured](https://github.com/dirkbosman/node-postgresql-destructured)
- [Part 3: node-postgresql-controllers](https://github.com/dirkbosman/node-postgresql-controllers)
---
- [Part 4a: node-mongodb-controllers](https://github.com/dirkbosman/node-mongodb-controllers)
- Part 4b: Combine [node-mongodb-clientforserver](https://github.com/dirkbosman/node-mongodb-clientforserver) + [node-mongodb-controllers](https://github.com/dirkbosman/node-mongodb-controllers)

### MongoDB & Mongoose

If you your Mongo Atlas server ha been corrently set-up (follow the Mongo Atlas Onboarding tut), you can create an `.env`-file with your connection details and try to connect. If you run `npm start` and you get the output below, you have successfully made a connection from your local environment. Note that you might have to set/reset your IP up for this to work (maybe even more than once).

```
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
connected
Mongo DB connected cluster0-shard-50-60.xxxx.mongodb.net
```

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

#### Connecting two MongoDB-collections

Relationships in the traditional sense don’t really exist in MongoDB like they do in MySQL ([Source](https://vegibit.com/mongoose-relationships-tutorial/)). In other words, related data is not explicitly enforced by MongoDB, but you can map to two (or more) collections. The strategy we will follow for setting up a request to get order from a specific user is, create an `Orders`-model, and then user that order model in the `Users`-controller (and not in the orders' controller).

After creating this code, you can go ahead and test it in the browser or in the terminal:

```
curl http://localhost:3000/users/5f5004d9713aed0a426bb060 | jq .
curl http://localhost:3000/users/5f5004d9713aed0a426bb060/orders | jq .
```

To further extend the code, we can also add a filter in the getUserOrders-route to answer this next questions:

- i.e. give me all orders less than 2000 euros

Test it in the terminal:

```
curl http://localhost:3000/users/5f5004d9713aed0a426bb060/orders/?price[lte]=2000 | jq .
curl http://localhost:3000/users/5f5004d9713aed0a426bb060/orders/?price[gt]=2000 | jq .
```

An interesting follow-up question could be: How do you make the connection between `userId` and `_id` and not another collection's `userId` within the same model? Furthermore, if you delete a user_id, what happens with all the records from that userId? i.e. all the orders of that user.

- You don't really define a foreign key in NoSQL normally, but you can if you really want to intercept requests and check if the id is from an existing userId or not, but you would want to do this at the application layer (not db layer). This is one of the difference with explicitly defining a schema vs not.
- You could think about explicitly defining it in the Mongoose-[schema](https://mongoosejs.com/docs/guide.html), or think about adding another field in the users-collection with name "active" and status true or false, and then toggle between them.


#### Combine `node-mongodb-clientforserver` and `node-mongodb-controllers`

For the next step to work, you will need to download, install and initialise both of the two repos separately below. Note, you can combine both in one repo if you wish :)

node-mongodb-controllers
- Run server on port: 8000;

node-mongodb-clientforserver
- Run server on different port: 3000 and connect
- Currently I still have the Contentful details to connect to, but you can take that out and purely connect to the mongoDB to extract data from. So you will have to replace the ".env"-data with connection data to your server and mongodb. 


## Future Suggestions

- We only discusses about connecting collections in the same db, what about if I want to connect collections in two different mongo dbs? i.e. Creating two DBs (`operations` and `analytics`) so you run aggregated queries against your operations into analytics db on a daily, weekly, monthly basis.
