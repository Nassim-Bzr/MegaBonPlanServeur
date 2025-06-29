// models/utilisateur.model.js
module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    email: DataTypes.STRING,
    motdepasse: DataTypes.STRING,
    dateinscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isadmin: DataTypes.BOOLEAN
    // Colonnes temporairement commentées - exécute la migration pour les réactiver
    // verificationcode: DataTypes.STRING,
    // verificationcodeexpires: DataTypes.DATE,
    // isverified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false
    // }
  }, {
    tableName: 'utilisateur', // nom correct de la table
    timestamps: false
  });

  Utilisateur.associate = (models) => {
    Utilisateur.hasMany(models.bonplans, {
      foreignKey: 'id_utilisateur',
      as: 'bonplans'
    });
    Utilisateur.hasMany(models.commentaires, {
      foreignKey: 'id_utilisateur',
      as: 'commentaires'
    });
    Utilisateur.hasMany(models.codepromos, {
      foreignKey: 'id_utilisateur',
      as: 'codepromos'
    });
    Utilisateur.hasMany(models.discussions, {
      foreignKey: 'id_utilisateur',
      as: 'discussions'
    });
    Utilisateur.hasMany(models.likes, {
      foreignKey: 'id_utilisateur',
      as: 'likes'
    });
    Utilisateur.hasMany(models.LikeCommentaire, {
      foreignKey: 'id_utilisateur',
      as: 'likeCommentaires'
    });
    Utilisateur.hasMany(models.favoris, {
      foreignKey: 'id_utilisateur',
      as: 'favoris'
    });
    Utilisateur.hasOne(models.subscriptions, {
      foreignKey: 'id_utilisateur',
      as: 'subscription'
    });
  };

  return Utilisateur;
};
