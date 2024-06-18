'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discussion', 'authorId');
    await queryInterface.removeColumn('discussion', 'categoryId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('discussion', 'authorId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('discussion', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
