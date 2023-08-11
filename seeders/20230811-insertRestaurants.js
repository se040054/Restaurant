"use strict";

const json = require("../public/jsons/restaurant");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const restaurants = json.results.map((restaurant) => ({
      //插入用 不指定id
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
      userId: 2 , //記得指定
    }))
    
    await queryInterface.bulkInsert('Restaurants',restaurants,{})
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Restaurants', null, {});
    } 
  
};


//npx sequelize db:seed --seed 20230811-insertRestaurants.js