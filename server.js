require("dotenv").config();
require("colors");
const express = require("express");
const cors = require("cors");

const connectDB = require("./dbinit");
const users = require("./api/users");
const orders = require("./api/orders");
const errorHandler = require("./middleware/error");

const app = express();
const PORT = 8000;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/users", users);
app.use("/orders", orders);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Started server on port ${PORT}`.rainbow.bold.inverse)
);
