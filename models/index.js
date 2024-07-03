// models/index.js

const Sequelize = require('sequelize');
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env en développement
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('Chargement des variables d\'environnement en développement');
}

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Vérifiez que l'URL est correcte

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
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
db.likes = require("./likes.model.js")(sequelize, Sequelize);
db.likeCommentaires = require("./likeCommentaire.model.js")(sequelize, Sequelize);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Associations
db.bonplans.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });
db.utilisateurs.hasMany(db.bonplans, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });

db.bonplans.hasMany(db.favoris, { as: 'Favoris', foreignKey: 'id_bonplan', onDelete: 'CASCADE' });
db.favoris.belongsTo(db.bonplans, { as: 'BonPlan', foreignKey: 'id_bonplan', onDelete: 'CASCADE' });

db.bonplans.hasMany(db.commentaires, { foreignKey: 'id_bonplan', as: 'commentaires', onDelete: 'CASCADE' });
db.commentaires.belongsTo(db.bonplans, { foreignKey: 'id_bonplan', as: 'bonplan', onDelete: 'CASCADE' });

db.commentaires.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', as: 'utilisateur', onDelete: 'CASCADE' });
db.utilisateurs.hasMany(db.commentaires, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });

db.bonplans.belongsTo(db.categories, { foreignKey: 'id_categorie', onDelete: 'CASCADE' });
db.categories.hasMany(db.bonplans, { foreignKey: 'id_categorie', onDelete: 'CASCADE' });

db.codepromos.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', as: 'Utilisateur', onDelete: 'CASCADE' });
db.utilisateurs.hasMany(db.codepromos, { foreignKey: 'id_utilisateur', as: 'CodePromos', onDelete: 'CASCADE' });

db.discussions.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });
db.utilisateurs.hasMany(db.discussions, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });

db.discussions.belongsTo(db.categories, { foreignKey: 'id_category', onDelete: 'CASCADE' });
db.categories.hasMany(db.discussions, { foreignKey: 'id_category', onDelete: 'CASCADE' });

db.likes.belongsTo(db.utilisateurs, { foreignKey: 'id_utilisateur', onDelete: 'CASCADE' });
db.likes.belongsTo(db.bonplans, { foreignKey: 'id_bonplan', onDelete: 'CASCADE' });
db.bonplans.hasMany(db.likes, { foreignKey: 'id_bonplan', onDelete: 'CASCADE' });

module.exports = db;
