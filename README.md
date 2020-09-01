# node-SQL-boilerplate
Node SQL sample project

1. If you haven't done it yet, create _POST_ _PUT_ and _DELETE_ routes for orders
2. Move the business logic of the orders in the `controllers/orders.js` as it's been done for users.
3. (OPTIONAL) Look into [sequelize](https://sequelize.org/master/), an ORM for SQL 

```
curl -d '{"name": "Jiggly", "surname": "Puff", "age": 100}' -H "Content-Type: application/json" -X POST http://localhost:3000/users
curl -d '{"name": "Jiggly", "surname": "Puff", "age": 3}' -H "Content-Type: application/json" -X PUT http://localhost:3000/users/2
curl -d '{"price": 10, "user": 2}' -H "Content-Type: application/json" -X POST http://localhost:3000/orders
curl -d '{"price": 12, "user": 5}' -H "Content-Type: application/json" -X PUT http://localhost:3000/orders/5
```
