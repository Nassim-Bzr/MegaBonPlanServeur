const Sequelize = require('sequelize');
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env en développement
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Test de connexion
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données établie avec succès.'))
  .catch(err => console.error('Impossible de se connecter à la base de données:', err));

// Modèles
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
db.bonplans.hasMany(db.commentaires, {
  foreignKey: 'id_bonplan',
  as: 'commentaires'
});
db.commentaires.belongsTo(db.bonplans, {
  foreignKey: 'id_bonplan',
  as: 'bonplan'
});
db.bonplans.belongsTo(db.categories, { foreignKey: 'id_categorie' });
db.categories.hasMany(db.bonplans, { foreignKey: 'id_categorie' });
db.codepromos.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', as: 'Utilisateur' });
db.utilisateurs.hasMany(db.codepromos, { foreignKey: 'id_utilisateur', as: 'CodePromos' });

module.exports = db;
