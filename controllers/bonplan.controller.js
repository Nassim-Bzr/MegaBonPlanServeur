const nodemailer = require('nodemailer');
const db = require("../models");
const BonPlan = db.bonplans; 
const Like = db.likes;
const Subscription = db.subscription; 
const Utilisateur = db.utilisateurs;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer des emails de notification
async function sendNotificationEmail(email, categoryName, bonPlanTitle) {
  let info = await transporter.sendMail({
    from: '"MegaBonPlan" <megabonplan@example.com>',
    to: email,
    subject: `Nouveau bon plan dans la catégorie ${categoryName}`,
    text: `Un nouveau bon plan intitulé "${bonPlanTitle}" a été publié dans la catégorie ${categoryName}.`,
    html: `<p>Un nouveau bon plan intitulé "<strong>${bonPlanTitle}</strong>" a été publié dans la catégorie ${categoryName}.</p>`,
  });

  console.log('Message sent: %s', info.messageId);
}

exports.create = async (req, res) => {
  try {
    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est disponible dans req.user après authentification
    const bonPlanData = {
      ...req.body,
      img_upload: req.file ? `/uploads/${req.file.filename}` : null,
      id_utilisateur: userId
    };

    const newBonPlan = await db.BonPlan.create(bonPlanData);

    res.status(201).send(newBonPlan);
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de la création de l'annonce.", error: error.message });
  }
};

// Ajoutez vos autres méthodes de contrôleur ici...

// Exemples de méthodes existantes que vous avez fournies :
exports.like = async (req, res) => {
  const { id_bonplan, id_utilisateur } = req.body;

  try {
    const existingLike = await Like.findOne({
      where: {
        id_bonplan: id_bonplan,
        id_utilisateur: id_utilisateur
      }
    });

    if (existingLike) {
      return res.status(400).send({ message: "Vous avez déjà liké ce bon plan." });
    }

    await Like.create({
      id_bonplan: id_bonplan,
      id_utilisateur: id_utilisateur
    });

    await BonPlan.increment('likes', { where: { id_bonplan: id_bonplan } });

    res.send({ message: "Bon plan liké avec succès!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors du like du bon plan."
    });
  }
};

exports.findAllByCategory = async (req, res) => {
  const idCategorie = req.params.idCategorie;
  try {
    const data = await BonPlan.findAll({
      where: {
        id_categorie: idCategorie
      },
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom']
        }
      ]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de la récupération des bons plans pour la catégorie ID ${idCategorie}: ${err.message}`
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await BonPlan.findAll({
      include: [{
        model: db.commentaires,
        as: 'commentaires',
        attributes: ['id_commentaire', 'contenu', 'datecommentaire', 'id_utilisateur']
      }]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la récupération des bons plans."
    });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await BonPlan.findByPk(id, {
      include: [{
        model: db.commentaires,
        as: 'commentaires',
        attributes: ['id_commentaire', 'contenu', 'datecommentaire', 'id_utilisateur']
      }]
    });
    if (data) {
      console.log(data); // Ajout d'un log pour vérifier les données
      res.send(data);
    } else {
      res.status(404).send({
        message: `Aucun BonPlan trouvé avec l'ID ${id}.`
      });
    }
  } catch (err) {
    console.error(err); // Ajout d'un log pour les erreurs
    res.status(500).send({
      message: "Erreur lors de la récupération du BonPlan avec l'ID " + id
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await BonPlan.update(req.body, {
      where: {
        id_bonplan: id
      }
    });
    if (num == 1) {
      res.send({
        message: "Le BonPlanx a été miseeee à jour avec succès."
      });
    } else {
      res.send({
        message: `Impossible de mettre à jour le BonPlan avec l'ID=${id}. Peut-être que le BonPlan n'a pas été trouvé ou req.body est vide!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Erreur lors de la mise à jour du BonPlan avec l'ID " + id
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await BonPlan.destroy({
      where: {
        ID_BonPlan: id
      }
    });
    if (num == 1) {
      res.send({
        message: "Le BonPlan a été supprimé avec succès!"
      });
    } else {
      res.send({
        message: `Impossible de supprimer le BonPlan avec l'ID=${id}. Peut-être que le BonPlan n'a pas été trouvé!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Impossible de supprimer le BonPlan avec l'ID " + id
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const data = await BonPlan.destroy({
      where: {},
      truncate: false
    });
    res.send({
      message: `${data} bon plans ont été supprimés avec succès !`
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la suppression des bon plans."
    });
  }
};

exports.findByCategory = async (req, res) => {
  const idCategorie = req.params.idCategorie;
  try {
    const data = await BonPlan.findAll({
      where: {
       id_categorie : idCategorie
      }
    });
    if (data.length > 0) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Aucun bon plan trouvé pour la catégorie ID ${idCategorie}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de la récupération des bons plans pour la catégorie ID ${idCategorie}: ${err.message}`
    });
  }
};

exports.findPending = async (req, res) => {
  try {
    const pendingBonPlans = await BonPlan.findAll({
      where: {
        approuvéparadmin: false
      }
    });
    res.send(pendingBonPlans);
  } catch (err) {
    res.status(500).send({
      message: "Une erreur est survenue lors de la récupération des bons plans en attente: " + err.message
    });
  }
};

exports.toggleApproval = async (req, res) => {
  const id = req.params.id;
  try {
    const bonPlan = await BonPlan.findByPk(id);
    if (!bonPlan) {
      return res.status(404).send({
        message: `BonPlan avec l'ID ${id} non trouvé.`
      });
    }

    const updated = await bonPlan.update({
      approuvéparadmin: !bonPlan.approuvéparadmin
    });

    res.send({
      message: "L'état d'approbation du bon plan a été modifié.",
      bonPlan: updated
    });
  } catch (err) {
    res.status(500).send({
      message: `Erreur lors de la modification de l'état d'approbation du bon plan avec l'ID ${id}: ${err.message}`
    });
  }
};
