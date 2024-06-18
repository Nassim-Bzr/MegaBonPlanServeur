'use strict';
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('discussion', 'id_utilisateur', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateurs', // nom de la table utilisateur
        key: 'id_utilisateur'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('discussion', 'id_category', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories', // nom de la table categorie
        key: 'id_categorie'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discussion', 'id_utilisateur');
    await queryInterface.removeColumn('discussion', 'id_category');
  }
};
