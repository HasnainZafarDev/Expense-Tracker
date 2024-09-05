const { DataTypes } = require("sequelize");
const sequelize = require("../connection/dbConnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Table = "User";

const User = sequelize.define(
  Table,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
User.associate = (models) => {
  User.hasMany(models.Expense, {
    foreignKey: "userId",
    as: "expenses",
  });
};
User.prototype.isPasswordMatched = async function (password) {
  return await bcrypt.compare(password, this.password);
};
User.prototype.generateToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    }
  );
};
module.exports = User;
