"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("notifications", "friend_status", {
      type: Sequelize.BOOLEAN, // Здесь указывается тип данных поля, в данном случае строка
      allowNull: false, // Если не нужно допускать пустые значения, установите allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("notifications", "friend_status");
  },
};
