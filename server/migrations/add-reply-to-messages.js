'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('messages', 'replyMessageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('messages', 'replyMessageId');
  }
};
