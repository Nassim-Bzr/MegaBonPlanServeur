const db = require('../models');
const { Op } = require("sequelize");

const Commentary = db.commentaires;


// controllers/commentaire.controller.js


// Récupérer tous les commentaires pour un bon plan spécifique
exports.findByBonPlanId = async (req, res) => {
  const id_bonplan = req.params.id_bonplan;
  try {
    const commentaires = await Commentary.findAll({
      where: {
        id_bonplan: id_bonplan
      },
      include: [{
        model: db.utilisateurs,
        as: 'utilisateur',
        attributes: ['nom']
      }]
    });
    res.send(commentaires);
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de la récupération des commentaires pour le bon plan ID ${id_bonplan}: ${err.message}`
    });
  }
};


//delete all 

exports.deleteAll = async (req, res) => {
  try {
    await Commentary.destroy({ where: {} });
    res.send({ message: "Tous les commentaires ont été supprimés avec succès" });
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la suppression des commentaires"
    });
  }
};


exports.getAllcommentary = async (req, res) => {
  try {
    const commentaries = await Commentary.findAll();
    res.send(commentaries);
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la récupération des commentaires"
    });
  }
};
exports.create = async (req, res) => {
  if (!req.body.contenu || !req.body.id_bonplan) {
      return res.status(400).send({ message: "Tous les champs sont requis: contenu, id_utilisateur, id_bonplan" });
  }

  const commentary = {
      contenu: req.body.contenu,
      id_utilisateur: req.body.id_utilisateur,
      id_bonplan: req.body.id_bonplan,
      datecommentaire: new Date() // Utiliser la date du serveur pour la création
  };

  try {
      const data = await Commentary.create(commentary);
      res.send(data);
  } catch (err) {
      res.status(500).send({
          message: err.message || "Une erreur est survenue lors de la création du commentaire."
      });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    // Ici, vous pourriez ajouter une vérification pour s'assurer que l'utilisateur est un administrateur
    // Exemple : if (!req.user.isAdmin) { return res.status(403).send({ message: "Accès refusé" }); }

    const comment = await Commentary.findByPk(id);
    if (!comment) {
      return res.status(404).send({
        message: "Commentaire non trouvé"
      });
    }

    await comment.destroy();
    res.send({
      message: "Commentaire supprimé avec succès"
    });
  } catch (error) {
    res.status(500).send({
      message: "Erreur lors de la suppression du commentaire"
    });
  }
};