const { Sequelize, DataTypes } = require("sequelize");
const db = require("../database/db");

const User = db.define(
  "user",
  {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = User;
