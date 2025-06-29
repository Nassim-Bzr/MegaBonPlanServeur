// favoris.model.js
module.exports = (sequelize, DataTypes) => {
    const Favoris = sequelize.define("Favoris", {
        id_favoris: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_bonplan: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'favoris', // Assurez-vous que cela correspond exactement au nom de votre table dans PostgreSQL
      freezeTableName: true, // Empêche Sequelize de pluraliser le nom de la table
      timestamps: false // Désactive les colonnes de timestamp si elles ne sont pas utilisées
    });

    Favoris.associate = (models) => {
      Favoris.belongsTo(models.utilisateurs, {
        foreignKey: 'id_utilisateur',
        as: 'utilisateur'
      });
      Favoris.belongsTo(models.bonplans, {
        foreignKey: 'id_bonplan',
        as: 'bonplan'
      });
    };
  
    return Favoris;
  };
  