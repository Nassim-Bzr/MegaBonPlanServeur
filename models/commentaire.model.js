// commentaire.model.js

module.exports = (sequelize, DataTypes) => {
  const Commentaire = sequelize.define(
    "Commentaire",
    {
      id_commentaire: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contenu: {
        type: DataTypes.TEXT,
      },
      datecommentaire: {
        type: DataTypes.DATE,
      },
      id_utilisateur: {
        type: DataTypes.INTEGER,
      },
      id_bonplan: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      tableName: "commentaire",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return Commentaire;
};
