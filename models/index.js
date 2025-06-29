// models/index.js

const Sequelize = require('sequelize');
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir du fichier .env en développement
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('Chargement des variables d\'environnement en développement');
}

// Configuration pour base de données locale ou distante
let sequelize;
if (process.env.DATABASE_URL) {
  // Configuration pour base de données distante (Heroku, etc.)
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
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
} else {
  // Configuration pour base de données locale
  console.log('Utilisation de la base de données locale');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT || 5432,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

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
db.LikeCommentaire = require("./likeCommentaire.model.js")(sequelize, Sequelize);
db.subscriptions = require("./subscription.model.js")(sequelize, Sequelize);

// Appel des associations définies dans chaque modèle
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
