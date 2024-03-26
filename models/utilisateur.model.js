// utilisateur.model.js

module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define("Utilisateur", {
    ID_Utilisateur: {
      type: DataTypes.INTEGER,
      references: {
        model: 'NomDuModèleUtilisateur', // Assurez-vous que cela correspond au nom du modèle Sequelize pour la table utilisateur
        key: 'id_utilisateur', // Utilisez le nom exact de la colonne tel qu'il apparaît dans la base de données
      },
      field: 'id_utilisateur' // Assurez-vous que cela correspond exactement au nom de la colonne dans la base de données
    }
,    
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
