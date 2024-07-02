const db = require('../models');
const { Op } = require("sequelize");

const Commentary = db.commentaires;
const LikeCommentaire = db.likeCommentaires;

// Récupérer tous les commentaires pour un bon plan spécifique
exports.findByBonPlanId = async (req, res) => {
  const id_bonplan = req.params.id_bonplan;
  try {
    const commentaires = await Commentary.findAll({
      where: { id_bonplan },
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

// Supprimer tous les commentaires
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

// Récupérer tous les commentaires
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

// Créer un commentaire
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

// Supprimer un commentaire
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
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

// Ajouter un like à un commentaire
exports.addLike = async (req, res) => {
  const { id_commentaire, id_utilisateur } = req.body;

  try {
    const existingLike = await LikeCommentaire.findOne({
      where: { id_commentaire, id_utilisateur }
    });

    if (existingLike) {
      return res.status(400).send({ message: "Like déjà existant pour cet utilisateur." });
    }

    const newLike = await LikeCommentaire.create({ id_commentaire, id_utilisateur });
    res.status(201).send(newLike);
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de l'ajout du like: ${err.message}`
    });
  }
};

// Récupérer les likes d'un commentaire
exports.getLikes = async (req, res) => {
  const id_commentaire = req.params.id_commentaire;

  try {
    const likes = await LikeCommentaire.findAll({
      where: { id_commentaire }
    });

    res.send(likes);
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de la récupération des likes: ${err.message}`
    });
  }
};
