'use strict';

const json = require('../public/jsons/restaurant')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let restaurants=json.results.map(restaurant=>({
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
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('Restaurants',restaurants,{}
     )
  },

  async down (queryInterface, Sequelize) {
     queryInterface.bulkDelete('Restaurants', null, {});
    
  }
};
