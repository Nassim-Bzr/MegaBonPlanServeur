module.exports = app => {
    const bonplans = require("../controllers/bonplan.controller.js");
    const upload = require('../middleware/upload');
  
    var router = require("express").Router();
  
    // Créer un nouveau bon plan
    router.post("/", upload.single('image'), bonplans.create);
  
      // Récupérer tous les bon plans
  router.get("/", bonplans.findAll);

  // Récupérer les deals les plus chauds (tri par température)
  router.get("/hot", bonplans.findHotDeals);

  // Récupérer tous les bon plans pour une catégorie spécifique
  router.get("/category/:idCategorie", bonplans.findByCategory);
  
    // Récupérer les bon plans non approuvés
    router.get("/pending", bonplans.findPending);
  
    // Basculer l'approbation d'un bon plan
    router.put("/toggleApproval/:id", bonplans.toggleApproval);
  
    // Récupérer un bon plan par ID
    router.get("/:id", bonplans.findOne);
  
    // Mettre à jour un bon plan par ID
    router.put("/:id", bonplans.update);
  
    // Supprimer un bon plan par ID
    router.delete("/:id", bonplans.delete);
  
    // Supprimer tous les bon plans
    router.delete("/", bonplans.deleteAll);
  
    // Ajouter la route pour les likes
    router.post("/like", bonplans.like);
  
    app.use('/api/bonplans', router);
  };
  