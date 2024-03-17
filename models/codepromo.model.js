// codepromo.model.js

module.exports = (sequelize, DataTypes) => {
  const CodePromo = sequelize.define("CodePromo", {
    ID_CodePromo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Code: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.TEXT,
    },
    DateExpiration: {
      type: DataTypes.DATE,
    },
    ApprouveParAdmin: {
      type: DataTypes.BOOLEAN,
    },
  });

  return CodePromo;
};
