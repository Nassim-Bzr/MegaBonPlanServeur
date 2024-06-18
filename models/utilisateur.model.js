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
    isadmin: DataTypes.BOOLEAN,
    verificationcode: DataTypes.STRING,
    verificationcodeexpires: DataTypes.DATE,
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'utilisateur', // nom correct de la table
    timestamps: false
  });

  return Utilisateur;
};
