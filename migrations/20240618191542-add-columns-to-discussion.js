'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('discussion');
    
    if (!tableInfo['id_utilisateur']) {
      await queryInterface.addColumn('discussion', 'id_utilisateur', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'utilisateur', // nom correct de la table
          key: 'id_utilisateur'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }

    if (!tableInfo['id_category']) {
      await queryInterface.addColumn('discussion', 'id_category', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorie', // nom correct de la table
          key: 'id_categorie'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discussion', 'id_utilisateur');
    await queryInterface.removeColumn('discussion', 'id_category');
  }
};
