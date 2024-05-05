// routes/bonplan.routes.js

module.exports = app => {
    const bonplans = require("../controllers/bonplan.controller");
    var router = require("express").Router();
  
    // Ajoutez d'abord la route pour les bons plans en attente
    router.get("/pending", bonplans.findPending); // Récupérer les bons plans non approuvés

    // Créer une nouvelle catégorie
    router.post("/", bonplans.create); // Appliquez authenticateUser si nécessaire
  
    // Récupérer tous les bons plans
    router.get("/", bonplans.findAll);

    // Récupérer un bon plan par son ID
    router.get("/:id", bonplans.findOne);
  
    // Mettre à jour un bon plan par son ID
    router.put("/:id", bonplans.update); // Appliquez authenticateUser si nécessaire

    // Basculer l'approbation d'un bon plan
    router.put("/:id/toggle-approve", bonplans.toggleApproval);

    // Supprimer un bon plan par son ID
    router.delete("/:id", bonplans.delete); // Appliquez authenticateUser si nécessaire

    // Supprimer tous les bons plans
    router.delete("/", bonplans.deleteAll);

    // Récupérer tous les bons plans pour une catégorie spécifique
    router.get("/category/:idCategorie", bonplans.findByCategory);

    app.use('/api/bonplans', router);
};
