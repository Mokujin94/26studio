'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
			queryInterface.addColumn(
		'users',
		'lastOnline',
		{
			type: Sequelize.DATE,
			allowNull: true
		}
	);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'lastOnline');
  }
};
