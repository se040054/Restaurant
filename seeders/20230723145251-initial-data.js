"use strict";

const json = require("../public/jsons/restaurant");
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction 
    const restaurants1to3 = json.results.slice(0, 3).map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
    }));
    const restaurants4to6 = json.results.slice(3, 6).map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
    }));
    const hash = await bcrypt.hash("12345678", 10);
    try {
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            id: 1,
            email: "user1@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            email: "user2@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        //userId 不能null 必須先插使用者
        "Restaurants",
        restaurants1to3.concat(restaurants4to6),
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) {
        console.log(error)
        await transaction.rollback();
      }
    }
  },

  async down(queryInterface, Sequelize) {
    let transaction 
    try{
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.bulkDelete("Restaurants", null, { transaction });
      await queryInterface.bulkDelete("Users", null, { transaction });
      await transaction.commit()
    }catch(error){
      if (transaction) {
        await transaction.rollback();
      }
    }
  },
};
