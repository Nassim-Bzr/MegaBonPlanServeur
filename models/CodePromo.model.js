module.exports = (sequelize, DataTypes) => {
  const CodePromo = sequelize.define("CodePromo", {
    id_codepromo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_codepromo'
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'code'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    dateexpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'dateexpiration'
    },
    marchand: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'marchand'
    },
    imgmarchand: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'imgmarchand'
    },
    reduction: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reduction'
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'montant'
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_utilisateur'
    },
    approuveparadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'approuvéparadmin'
    }
  }, {
    tableName: 'codepromo',
    timestamps: false
  });

  CodePromo.associate = (models) => {
    if (models.utilisateurs) {
      CodePromo.belongsTo(models.utilisateurs, {
        foreignKey: 'id_utilisateur',
        as: 'utilisateur'
      });
    }
  };

  return CodePromo;
}; 