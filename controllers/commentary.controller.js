const db = require('../models');
const { Op } = require("sequelize");

const Commentary = db.commentaires;

exports.create = async (req, res) => {
    // Valider la requête
    if (!req.body.contenu) {
      return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
    }
  
    // Créer une catégorie
    const commentary = {
        contenu: req.body.contenu,
        datecommentaire: req.body.datecommentaire
    };
  
    // Sauvegarder la catégorie dans la base de données
    try {
      const data = await Commentary.create(commentary);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Une erreur est survenue lors de la création de la catégorie."
      });
    }
  };