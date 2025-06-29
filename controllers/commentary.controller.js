const db = require("../models");
const Commentary = db.commentaires;
const User = db.utilisateurs;
const BonPlan = db.bonplans;
const LikeCommentaire = db.LikeCommentaire;

// Créer un nouveau commentaire
exports.create = async (req, res) => {
  try {
    const { contenu, id_bonplan, id_utilisateur } = req.body;

    if (!contenu || !id_bonplan || !id_utilisateur) {
      return res.status(400).send({
        message: "Le contenu, l'ID du bon plan et l'ID de l'utilisateur sont requis !"
      });
    }

    const commentaire = {
      contenu: contenu,
      id_bonplan: id_bonplan,
      id_utilisateur: id_utilisateur,
      datecommentaire: new Date()
    };

    const data = await Commentary.create(commentaire);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la création du commentaire."
    });
  }
};

// Récupérer tous les commentaires d'un bon plan
exports.findByBonPlanId = async (req, res) => {
  try {
    const id_bonplan = req.params.id_bonplan;
    
    const data = await Commentary.findAll({
      where: { id_bonplan: id_bonplan },
      include: [
        {
          model: User,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'email']
        }
      ],
      order: [['datecommentaire', 'DESC']]
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la récupération des commentaires."
    });
  }
};

// Récupérer tous les commentaires
exports.getAllcommentary = async (req, res) => {
  try {
    const data = await Commentary.findAll({
      include: [
        {
          model: User,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'email']
        },
        {
          model: BonPlan,
          as: 'bonplan',
          attributes: ['id_bonplan', 'titre']
        }
      ],
      order: [['datecommentaire', 'DESC']]
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la récupération des commentaires."
    });
  }
};

// Supprimer un commentaire par ID
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await Commentary.destroy({
      where: { id_commentaire: id }
    });

    if (num == 1) {
      res.send({
        message: "Commentaire supprimé avec succès !"
      });
    } else {
      res.send({
        message: `Impossible de supprimer le commentaire avec l'id=${id}. Le commentaire n'existe peut-être pas !`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la suppression du commentaire avec l'id=" + id
    });
  }
};

// Supprimer tous les commentaires
exports.deleteAll = async (req, res) => {
  try {
    const nums = await Commentary.destroy({
      where: {},
      truncate: false
    });

    res.send({ message: `${nums} commentaires ont été supprimés avec succès !` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la suppression de tous les commentaires."
    });
  }
};

// Ajouter un like à un commentaire
exports.addLike = async (req, res) => {
  try {
    const { id_commentaire, id_utilisateur } = req.body;

    if (!id_commentaire || !id_utilisateur) {
      return res.status(400).send({
        message: "L'ID du commentaire et l'ID de l'utilisateur sont requis !"
      });
    }

    // Vérifier si l'utilisateur a déjà liké ce commentaire
    const existingLike = await LikeCommentaire.findOne({
      where: {
        id_commentaire: id_commentaire,
        id_utilisateur: id_utilisateur
      }
    });

    if (existingLike) {
      // Si le like existe, le supprimer (unlike)
      await LikeCommentaire.destroy({
        where: {
          id_commentaire: id_commentaire,
          id_utilisateur: id_utilisateur
        }
      });
      res.send({ message: "Like supprimé avec succès !" });
    } else {
      // Sinon, ajouter le like
      const like = {
        id_commentaire: id_commentaire,
        id_utilisateur: id_utilisateur,
        date_like: new Date()
      };

      await LikeCommentaire.create(like);
      res.send({ message: "Like ajouté avec succès !" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de l'ajout/suppression du like."
    });
  }
};

// Récupérer le nombre de likes d'un commentaire
exports.getLikes = async (req, res) => {
  try {
    const id_commentaire = req.params.id_commentaire;
    
    const count = await LikeCommentaire.count({
      where: { id_commentaire: id_commentaire }
    });

    res.send({ likes: count });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la récupération des likes."
    });
  }
};
