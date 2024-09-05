const express = require("express");
const userRoute = require("./routes/user.routes");
const expenseRoute = require("./routes/expense.routes");

const app = express();
const db = require("./models/index");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/user-expense", expenseRoute);

module.exports = app;
