// categorie.model.js

module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define("Categorie", {
    ID_Categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NomCategorie: {
      type: DataTypes.STRING,
    },
  });

  return Categorie;
};
