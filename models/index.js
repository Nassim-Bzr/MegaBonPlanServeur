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

db.sequelize = sequelize; // Votre instance Sequelize
db.Sequelize = Sequelize;

db.utilisateurs = require("./utilisateur.model.js")(sequelize, Sequelize);
db.categories = require("./categorie.model.js")(sequelize, Sequelize);
db.bonplans = require("./bonplan.model.js")(sequelize, Sequelize);
db.commentaires = require("./commentaire.model.js")(sequelize, Sequelize);
db.favoris = require("./favori.model.js")(sequelize, Sequelize);
db.codepromos = require("./codepromo.model.js")(sequelize, Sequelize);
db.discussions = require("./discussion.model.js")(sequelize, Sequelize);

// Associations
db.utilisateurs.hasMany(db.bonplans);
db.bonplans.belongsTo(db.utilisateurs);

db.utilisateurs.hasMany(db.commentaires);
db.commentaires.belongsTo(db.utilisateurs);

db.categories.hasMany(db.bonplans);
db.bonplans.belongsTo(db.categories);

db.utilisateurs.belongsToMany(db.bonplans, { through: db.favoris });
db.bonplans.belongsToMany(db.utilisateurs, { through: db.favoris });

db.utilisateurs.hasMany(db.codepromos);
db.codepromos.belongsTo(db.utilisateurs);



module.exports = db;