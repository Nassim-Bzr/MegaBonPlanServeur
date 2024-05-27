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

db.favoris = require("./favoris.model.js")(sequelize, Sequelize);
db.utilisateurs = require("./utilisateur.model.js")(sequelize, Sequelize);
db.categories = require("./categorie.model.js")(sequelize, Sequelize);
db.bonplans = require("./bonplan.model.js")(sequelize, Sequelize);
db.commentaires = require("./commentaire.model.js")(sequelize, Sequelize);

db.codepromos = require("./CodePromo.model.js")(sequelize, Sequelize);
db.discussions = require("./discussion.model.js")(sequelize, Sequelize);

// Associations
db.bonplans.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur' });
db.utilisateurs.hasMany(db.bonplans, { foreignKey: 'id_utilisateur' });

db.bonplans.hasMany(db.favoris, { as: 'Favoris', foreignKey: 'id_bonplan' });
db.favoris.belongsTo(db.bonplans, { as: 'BonPlan', foreignKey: 'id_bonplan' });

// Associations entre BonPlans et Commentaires
db.bonplans.hasMany(db.commentaires, {
  foreignKey: 'id_bonplan', // Assurez-vous que le nom de la clé étrangère est correct
  as: 'commentaires' // Cela permettra d'accéder aux commentaires par bonplan.commentaires
});

db.commentaires.belongsTo(db.bonplans, {
  foreignKey: 'id_bonplan',
  as: 'bonplan' // Cela permettra d'accéder au bon plan associé à un commentaire par commentaire.bonplan
});
db.bonplans.belongsTo(db.categories, { foreignKey: 'id_categorie' });
db.categories.hasMany(db.bonplans, { foreignKey: 'id_categorie' });



db.codepromos.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', as: 'Utilisateur' });
db.utilisateurs.hasMany(db.codepromos, { foreignKey: 'id_utilisateur', as: 'CodePromos' });

module.exports = db;