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
      defaultValue: DataTypes.NOW // Définit la date et l'heure actuelles comme valeur par défaut
    },
    isadmin: DataTypes.BOOLEAN
  }, {
    tableName: 'utilisateur',
    timestamps: false
  });

  return Utilisateur;
};
