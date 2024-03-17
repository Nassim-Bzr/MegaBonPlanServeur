// routes/category.routes.js

module.exports = app => {
    const categories = require("../controllers/category.controller");

  
    var router = require("express").Router();
  
    // Créer une nouvelle catégorie
    router.post("/", categories.create); // Appliquez authenticateUser si nécessaire
  
    // Récupérer toutes les catégories
    router.get("/", categories.findAll);
  
  /*   // Récupérer une catégorie par son ID
    router.get("/:id", categories.findOne);
  
    // Mettre à jour une catégorie par son ID
    router.put("/:id", categories.update); // Appliquez authenticateUser si nécessaire
  
    // Supprimer une catégorie par son ID
    router.delete("/:id", categories.delete); // Appliquez authenticateUser si nécessaire
  
    // Supprimer toutes les catégories
    router.delete("/", categories.deleteAll); // Appliquez authenticateUser si nécessaire */
  
    app.use('/api/categories', router);
  };
  