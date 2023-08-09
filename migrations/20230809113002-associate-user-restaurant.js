'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Restaurants", "userId", { //指向mysql
      type: Sequelize.INTEGER,
      references: {
        model: "Users", //這裡還是用回model
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Restaurants", "userId")
  }
};
