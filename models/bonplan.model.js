// bonplan.model.js

module.exports = (sequelize, DataTypes) => {
  const BonPlan = sequelize.define("BonPlan", {
    ID_BonPlan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Titre: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.TEXT,
    },
    LienAffiliation: {
      type: DataTypes.STRING,
    },
    DatePost: {
      type: DataTypes.DATE,
    },
    ApprouveParAdmin: {
      type: DataTypes.BOOLEAN,
    },
  });

  return BonPlan;
};
