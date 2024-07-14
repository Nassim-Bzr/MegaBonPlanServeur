// bonplan.model.js
module.exports = (sequelize, DataTypes) => {
  const BonPlan = sequelize.define("BonPlan", {
    id_bonplan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    lienaffiliation: {
      type: DataTypes.STRING,
    },
    datepost: {
      type: DataTypes.DATE,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
    },
    id_categorie: {
      type: DataTypes.INTEGER,
    },
    imglink: {
      type: DataTypes.STRING,
    },
    approuvéparadmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'bonplan',
    timestamps: false,
    freezeTableName: true,
  });

  BonPlan.associate = (models) => {
    BonPlan.hasMany(models.Commentaire, {
      foreignKey: 'id_bonplan',
      as: 'commentaires',
    });
  };

  return BonPlan;
};
