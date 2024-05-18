// controllers/bonplan.controller.js
const db = require("../models");
const BonPlan = db.bonplans; // Assurez-vous que cela correspond à la façon dont vous avez exporté et structuré votre modèle BonPlan

// Créer et sauvegarder un nouveau BonPlan
// controllers/bonplan.controller.js

// Créer et sauvegarder un nouveau BonPlan// controllers/bonplan.controller.js

// Créer et sauvegarder un nouveau BonPlan
// controllers/bonplan.controller.js

// Créer et sauvegarder un nouveau BonPlan
exports.create = async (req, res) => {
  if (!req.body.Titre) {
    return res.status(400).send({
      message: "Le titre est nécessaire."
    });
  }

  const bonPlan = {
    Titre: req.body.Titre,
    Description: req.body.Description,
    LienAffiliation: req.body.LienAffiliation,
    ID_Categorie: req.body.ID_Categorie,
    DatePost: req.body.DatePost || new Date(),
    ApprouveParAdmin: req.body.ApprouveParAdmin || false,
    imglink: req.body.imglink // Utilisation directe de l'URL fournie
  };

  try {
    const newBonPlan = await BonPlan.create(bonPlan);
    res.send(newBonPlan);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la création du bon plan."
    });
  }
};









// Récupérer tous les BonPlans
exports.findAll = async (req, res) => {
  try {
    const data = await BonPlan.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la récupération des bons plans."
    });
  }
};

// Trouver un BonPlan par son ID

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

// Mettre à jour un BonPlan
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await BonPlan.update(req.body, {
      where: {
        ID_BonPlan: id
      }
    });
    if (num == 1) {
      res.send({
        message: "Le BonPlan a été mis à jour avec succès."
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

// Supprimer un BonPlan
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


// Supprimer tout les bon plans

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
}

// Récupérer tous les BonPlans pour une catégorie spécifique
exports.findByCategory = async (req, res) => {
  const idCategorie = req.params.idCategorie;
  try {
    const data = await BonPlan.findAll({
      where: {
        ID_Categorie: idCategorie
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

// Récupérer tous les BonPlans non approuvés
// controllers/bonplan.controller.js
exports.findPending = async (req, res) => {
  try {
    const pendingBonPlans = await BonPlan.findAll({
      where: {
        ApprouveParAdmin: false
      }
    });
    res.send(pendingBonPlans);
  } catch (err) {
    res.status(500).send({
      message: "Une erreur est survenue lors de la récupération des bons plans en attente: " + err.message
    });
  }
};

// Basculer l'approbation d'un bon plan
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
      ApprouveParAdmin: !bonPlan.ApprouveParAdmin
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