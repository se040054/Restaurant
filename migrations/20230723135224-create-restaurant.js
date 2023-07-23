'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      name_en: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      google_map: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.FLOAT.UNSIGNED
      },
      description: {
        type: Sequelize.TEXT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants');
  }
};