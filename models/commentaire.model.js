// models/commentaire.model.js

module.exports = (sequelize, DataTypes) => {
  const Commentaire = sequelize.define("Commentaire", {
    id_commentaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
    datecommentaire: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_bonplan: {
      type: DataTypes.INTEGER,
      references: {
        model: 'bonplan',
        key: 'id_bonplan',
      }
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur',
      }
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });

  Commentaire.associate = (models) => {
    Commentaire.belongsTo(models.BonPlan, {
      foreignKey: 'id_bonplan',
      as: 'bonplan',
    });
    Commentaire.belongsTo(models.Utilisateur, {
      foreignKey: 'id_utilisateur',
      as: 'utilisateur',
    });
  };

  return Commentaire;
};
