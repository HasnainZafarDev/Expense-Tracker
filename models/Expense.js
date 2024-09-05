const { DataTypes } = require("sequelize");
const sequelize = require("../connection/dbConnection");
const Table = "Expense";
const Expense = sequelize.define(Table, {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.ENUM(
      "Food",
      "Travel",
      "Utilities",
      "Entertainment",
      "Other"
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});

Expense.associate = (models) => {
  Expense.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

module.exports = Expense;
