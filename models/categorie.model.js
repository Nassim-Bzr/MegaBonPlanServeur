module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define("Categorie", {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_categorie'
    },
    nomcategorie: {
      type: DataTypes.STRING,
      field: 'nomcategorie',
      allowNull: false
    },
    imglink: {
      type: DataTypes.STRING,
      field: 'imglink',
      allowNull: false
    }
  }, {
    tableName: 'categorie', // nom correct de la table
    timestamps: false,
    freezeTableName: true
  });

  Categorie.associate = (models) => {
    Categorie.hasMany(models.bonplans, {
      foreignKey: 'id_categorie',
      as: 'bonplans'
    });
    Categorie.hasMany(models.discussions, {
      foreignKey: 'id_category',
      as: 'discussions'
    });
  };

  return Categorie;
};
