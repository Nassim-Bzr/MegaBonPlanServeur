// models/index.js
const { Sequelize } = require("sequelize");
require('dotenv').config();

// Configuration de la connexion à la base de données
const config = require("../config/db.config.js");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Exporter l'objet db pour l'utiliser dans les autres parties de l'application
module.exports = db;
