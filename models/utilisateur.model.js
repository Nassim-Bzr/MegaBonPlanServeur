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
    isverified: { // Nouveau champ
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'utilisateur',
    timestamps: false
  });

  return Utilisateur;
};
