// category.controller.js
const db = require("../models");
const Category = db.categories;

// Créer et sauvegarder une nouvelle catégorie
exports.create = async (req, res) => {
  // Valider la requête
  if (!req.body.nomcategorie) {
    return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
  }

  // Créer une catégorie
  const category = {
    nomcategorie: req.body.nomcategorie
  };

  // Sauvegarder la catégorie dans la base de données
  try {
    const data = await Category.create(category);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la création de la catégorie."
    });
  }
};









// Récupérer toutes les catégories de la base de données
exports.findAll = async (req, res) => {
  try {
    const data = await Category.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la récupération des catégories."
    });
  }
};
