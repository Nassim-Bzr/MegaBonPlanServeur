// favori.model.js

module.exports = (sequelize, DataTypes) => {
  const Favori = sequelize.define("Favori", {}, { timestamps: false });
  return Favori;
};
