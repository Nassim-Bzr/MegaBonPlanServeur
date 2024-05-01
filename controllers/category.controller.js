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
    nomcategorie: req.body.nomcategorie,
    imglink: req.body.imglink
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

// modifier une categorie

exports.update = async (req, res) => {
  const id = req.params.id;

  if (!req.body.nomcategorie) {
    return res.status(400).send({
      message: "Le contenu ne peut pas être vide !"
    });
  }

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).send({
        message: `La catégorie avec l'ID ${id} n'a pas été trouvée.`
      });
    }

    category.nomcategorie = req.body.nomcategorie;
    category.imglink = req.body.imglink;

    await category.save();

    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la mise à jour de la catégorie."
    });
  }
}
  //const nomCategorie = fields.nomcategorie;
  
  // Vérification si le

//delete categorie with id

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).send({
        message: `La catégorie avec l'ID ${id} n'a pas été trouvée.`
      });
    }

    await category.destroy();

    res.send({ message: `La catégorie avec l'ID ${id} a été supprimée avec succès !` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la suppression de la catégorie."
    });
  }
}

exports.deleteAll = async (req, res) => {
  try {
    const data = await Category.destroy({
      where: {},
      truncate: false
    });
    res.send({ message: `${data} catégories ont été supprimées avec succès !` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la suppression des catégories."
    });
  }
}

// Récupérer une catégorie par son ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).send({
        message: `La catégorie avec l'ID ${id} n'a pas été trouvée.`
      });
    }

    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la récupération de la catégorie."
    });
  }
}

