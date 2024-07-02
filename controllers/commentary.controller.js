// controllers/commentaire.controller.js

const db = require('../models');
const { Op } = require("sequelize");

const Commentary = db.commentaires;
const CommentaireLike = db.commentaireLikes;
const Utilisateur = db.utilisateurs;

exports.findByBonPlanId = async (req, res) => {
  const id_bonplan = req.params.id_bonplan;
  try {
    const commentaires = await Commentary.findAll({
      where: {
        id_bonplan: id_bonplan
      },
      include: [{
        model: Utilisateur,
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

exports.likeComment = async (req, res) => {
  const id_commentaire = req.params.id_commentaire;
  const id_utilisateur = req.user.id; // Assurez-vous que req.user contient l'utilisateur connecté

  try {
    // Vérifier si l'utilisateur a déjà liké ce commentaire
    const existingLike = await CommentaireLike.findOne({
      where: {
        id_commentaire: id_commentaire,
        id_utilisateur: id_utilisateur
      }
    });

    if (existingLike) {
      return res.status(400).send({ message: "Vous avez déjà liké ce commentaire." });
    }

    // Ajouter le like
    await CommentaireLike.create({
      id_commentaire: id_commentaire,
      id_utilisateur: id_utilisateur
    });

    // Mettre à jour le nombre de likes du commentaire
    const comment = await Commentary.findByPk(id_commentaire);
    comment.likes += 1;
    await comment.save();

    res.send({ message: "Commentaire liké avec succès." });
  } catch (error) {
    res.status(500).send({
      message: `Erreur lors du like du commentaire ID ${id_commentaire}: ${error.message}`
    });
  }
};
