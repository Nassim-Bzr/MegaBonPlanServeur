'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bonplan', 'prix_initial', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.addColumn('bonplan', 'prix_reduit', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bonplan', 'prix_initial');
    await queryInterface.removeColumn('bonplan', 'prix_reduit');
  }
};
