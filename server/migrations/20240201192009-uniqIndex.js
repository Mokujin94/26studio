"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("likes", ["projectId", "userId"], {
      unique: true,
      name: "unique_project_user_like",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("likes", "unique_project_user_like");
  },
};
