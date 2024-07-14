const express = require('express');
const router = express.Router();
const multer = require('multer');
const bonplans = require("../controllers/bonplan.controller");



// Créer une nouvelle catégorie
router.post("/", bonplans.create); // Le 'imglink' doit correspondre au 'name' de votre input de type file */

router.get("/pending", bonplans.findPending);

// Récupérer toutes les catégories
router.get("/", bonplans.findAll);

router.get("/:id", bonplans.findOne);

// Mettre à jour une catégorie par son ID
router.put("/:id", bonplans.update);

// Supprimer une catégorie par son ID
router.delete("/:id", bonplans.delete);

// Supprimer tout les bonplans
router.delete("/", bonplans.deleteAll);

// Récupérer tous les bons plans pour une catégorie spécifique
router.get("/category/:idCategorie", bonplans.findByCategory);

// Ajouter d'autres routes au besoin

module.exports = app => {
    app.use('/api/bonplans', router);
};
