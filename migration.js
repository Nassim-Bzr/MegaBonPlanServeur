'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajout de la colonne id_utilisateur
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

    // Ajout de la colonne id_category
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discussion', 'id_utilisateur');
    await queryInterface.removeColumn('discussion', 'id_category');
  }
};
