module.exports = (sequelize, DataTypes) => {
  const BonPlan = sequelize.define("bonplan", {
    id_bonplan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lienaffiliation: {
      type: DataTypes.STRING,
    },
    datepost: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur'
      }
    },
    id_categorie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorie',
        key: 'id_categorie'
      }
    },
    imglink: {
      type: DataTypes.STRING,
    },
    approuvéparadmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    prix_initial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prix_reduit: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },{
    tableName: 'bonplan',
    timestamps: false
  });

  return BonPlan;
};
