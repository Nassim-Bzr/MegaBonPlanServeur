const Sequelize = require('sequelize');
const config = require('../config/db.config.js');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données établie avec succès.'))
  .catch(err => console.error('Impossible de se connecter à la base de données:', err));

db.utilisateurs = require("./utilisateur.model.js")(sequelize, Sequelize);
db.categories = require("./categorie.model.js")(sequelize, Sequelize);
db.bonplans = require("./bonplan.model.js")(sequelize, Sequelize);
db.commentaires = require("./commentaire.model.js")(sequelize, Sequelize);

db.codepromos = require("./CodePromo.model.js")(sequelize, Sequelize);
db.discussions = require("./discussion.model.js")(sequelize, Sequelize);

// Associations
db.bonplans.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur' });
db.utilisateurs.hasMany(db.bonplans, { foreignKey: 'id_utilisateur' });

db.commentaires.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur' });
db.utilisateurs.hasMany(db.commentaires, { foreignKey: 'id_utilisateur' });

db.bonplans.belongsTo(db.categories, { foreignKey: 'ID_Categorie' });
db.categories.hasMany(db.bonplans, { foreignKey: 'ID_Categorie' });

db.utilisateurs.belongsToMany(db.bonplans, { through: 'favoris' });
db.bonplans.belongsToMany(db.utilisateurs, { through: 'favoris' });

db.codepromos.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', as: 'Utilisateur' });
db.utilisateurs.hasMany(db.codepromos, { foreignKey: 'id_utilisateur', as: 'CodePromos' });

module.exports = db;