const { DataTypes } = require("sequelize");
const db = require("../database/db");

const sales = db.define(
  "sales",
  {
    salesID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },

    totalRevenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    custName: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    customerContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    finalDiscount: {
      type: DataTypes.FLOAT,
    },
    soldDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "sales",
  }
);

module.exports = sales;
