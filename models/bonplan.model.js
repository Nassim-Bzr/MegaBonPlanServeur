// models/bonplan.model.js
module.exports = (sequelize, DataTypes) => {
  const BonPlan = sequelize.define("BonPlan", {
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
      allowNull: true
    },
    lienaffiliation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    datepost: {
      type: DataTypes.DATE,
      allowNull: false,
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
      allowNull: true
    },
    approuvéparadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    prix_initial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prix_reduit: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'bonplan',
    timestamps: false
  });

  return BonPlan;
};
