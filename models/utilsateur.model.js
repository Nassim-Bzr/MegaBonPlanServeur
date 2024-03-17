// utilisateur.model.js

module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define("Utilisateur", {
    ID_Utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nom: {
      type: DataTypes.STRING
    },
    Email: {
      type: DataTypes.STRING
    },
    MotDePasse: {
      type: DataTypes.STRING
    },
    DateInscription: {
      type: DataTypes.DATE
    },
    isAdmin: {
      type: DataTypes.BOOLEAN
    }
  });

  return Utilisateur;
};
