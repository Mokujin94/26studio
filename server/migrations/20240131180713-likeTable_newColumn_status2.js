"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("notifications", "status", {
      type: Sequelize.BOOLEAN, // Замените на тип данных, который соответствует вашим требованиям
      allowNull: false, // или false в зависимости от ваших требований
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("notifications", "status");
  },
};