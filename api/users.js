const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserOrders,
} = require("../controllers/users");

const api = express.Router();

api.route("/").get(getUsers).post(createUser);

api.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

// i.e.: localhost:3000/users/1234/orders
api.route("/:id/orders").get(getUserOrders);

module.exports = api;
