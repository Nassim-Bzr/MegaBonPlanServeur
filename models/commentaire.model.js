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
    },
    {
      tableName: "commentaire", // Ici tu forces Sequelize à utiliser le nom de table exact
      timestamps: false, // Désactivez les champs createdAt et updatedAt
      freezeTableName: true, // Empêche S
    }
  );

  return Commentaire;
};
