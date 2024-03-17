const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());

// Remplacez ces lignes si vous utilisez Sequelize et non directement pool
// const pool = require("./config/db.config.js"); 
var corsOptions = {
  origin: "*" // Autoriser toutes les origines
};

// Activation du middleware CORS avec les options configurées
app.use(cors(corsOptions));
// Importez vos routeurs
require('./routes/category.routes')(app);
// Répétez pour d'autres entités en important leurs routeurs correspondants


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Bonsoir grosse salope." });
});

// Utilisez vos routes importées ici. Supprimez les anciennes routes directes de pool.query.
// Exemple pour les utilisateurs:
// const userRoutes = require('./routes/user.routes');
// app.use('/api/utilisateurs', userRoutes);

// Vous pouvez également configurer le routeur directement ici, mais il est préférable de séparer en fichiers
// Exemple pour catégories:
// const categoryController = require('./controllers/category.controller');
// app.get("/api/categories", categoryController.findAll);

// Supprimez toutes les autres routes qui utilisent pool.query et remplacez-les par les routes utilisant Sequelize

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
