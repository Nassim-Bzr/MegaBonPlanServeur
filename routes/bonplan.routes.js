// routes/bonplan.routes.js

module.exports = app => {
    const bonplans = require("../controllers/bonplan.controller");

  
    var router = require("express").Router();
  
    // Créer une nouvelle catégorie
    router.post("/", bonplans.create); // Appliquez authenticateUser si nécessaire
  
    // Récupérer toutes les catégories
    router.get("/", bonplans.findAll);
  

    router.get("/:id", bonplans.findOne);
  
    // Mettre à jour une catégorie par son ID
    router.put("/:id", bonplans.update); // Appliquez authenticateUser si nécessaire
  
    // Supprimer une catégorie par son ID
    router.delete("/:id", bonplans.delete); // Appliquez authenticateUser si nécessaire

    // Supprimer tout les bonplans

    router.delete("/", bonplans.deleteAll);
  

    // Récupérer tous les bons plans pour une catégorie spécifique
router.get("/category/:idCategorie", bonplans.findByCategory);

    
  
    app.use('/api/bonplans', router);
  };
  