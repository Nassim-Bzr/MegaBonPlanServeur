module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define("Categorie", {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_categorie' // Assurez-vous que le nom de champ correspond à la base de données
    },
    nomcategorie: {
      type: DataTypes.STRING,
      field: 'nomcategorie', // Assurez-vous que le nom de champ correspond à la base de données
      allowNull: false // Assurez-vous que ce champ ne peut pas être null
    }
  }, {
    tableName: 'categorie', // Utilisez le nom exact de votre table ici
    timestamps: false, // Désactivez les champs createdAt et updatedAt
    freezeTableName: true // Empêche Sequelize de pluraliser le nom de la table
  });

  return Categorie;
};


