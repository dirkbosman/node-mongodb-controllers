require("dotenv").config();
const express = require("express");

const connectDB = require("./dbinit");
const users = require("./api/users");
const orders = require("./api/orders");
const errorHandler = require("./middleware/error");
const app = express();

connectDB();

app.use(express.json());
app.use("/users", users);
app.use("/orders", orders);
app.use(errorHandler);

app.listen("3000", () => console.log("connected"));
