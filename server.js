const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./config/db.config.js"); // Assurez-vous que le chemin est correct

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Bonsoir grosse salope." });
});

app.get("/utilisateurs", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Utilisateur');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des utilisateurs.");
  }
});
// Route pour récupérer toutes les catégories
app.get("/categories", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Categorie');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des catégories.");
  }
});

// Route pour récupérer tous les bons plans
app.get("/bonsplans", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM BonPlan');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des bons plans.");
  }
});

// Route pour récupérer tous les commentaires
app.get("/commentaires", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Commentaire');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des commentaires.");
  }
});

// Route pour récupérer tous les favoris
app.get("/favoris", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Favori');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des favoris.");
  }
});

// Route pour récupérer tous les codes promo
app.get("/codespromo", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM CodePromo');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des codes promo.");
  }
});

// Route pour récupérer toutes les discussions
app.get("/discussions", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Discussion');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des discussions.");
  }
});

// Route pour récupérer tous les messages
app.get("/messages", async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT * FROM Message');
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur lors de la récupération des messages.");
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
