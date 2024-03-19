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
require('./routes/bonplan.routes')(app);
// Répétez pour d'autres entités en important leurs routeurs correspondants


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Bonsoir." });
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
