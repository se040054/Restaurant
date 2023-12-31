'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Restaurant)
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: { allowNull: true, type: DataTypes.STRING },
      email: { allowNull: false, type: DataTypes.STRING },
      password: { allowNull: false, type: DataTypes.STRING },
      role: { allowNull: false, type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};