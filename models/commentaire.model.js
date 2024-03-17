// commentaire.model.js

module.exports = (sequelize, DataTypes) => {
    const Commentaire = sequelize.define("Commentaire", {
      ID_Commentaire: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Contenu: {
        type: DataTypes.TEXT
      },
      DateCommentaire: {
        type: DataTypes.DATE
      }
    });
  
    return Commentaire;
  };
  