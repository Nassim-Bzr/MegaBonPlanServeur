// models/codePromo.model.js

module.exports = (sequelize, DataTypes) => {
  const CodePromo = sequelize.define("CodePromo", {
      id_codepromo: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      code: {
          type: DataTypes.STRING
      },
      description: {
          type: DataTypes.TEXT
      },
      dateexpiration: {
          type: DataTypes.DATE
      },
      id_utilisateur: {
          type: DataTypes.INTEGER
      },
      approuvéparadmin: {
          type: DataTypes.BOOLEAN
      }
  }, {
      tableName: 'codepromo',
      timestamps: false
  });

  return CodePromo;
};
