// discussion.model.js

module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define("Discussion", {
    ID_Discussion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Titre: {
      type: DataTypes.STRING,
    },
    Contenu:{
      type: DataTypes.STRING,
    },
    DateCreation: {
      type: DataTypes.DATE,
    },
  });

  return Discussion;
};
