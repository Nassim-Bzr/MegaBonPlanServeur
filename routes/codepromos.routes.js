// routes/codePromo.routes.js

module.exports = app => {
    const codePromos = require("../controllers/codepromo.controller.js");
  
    var router = require("express").Router();
  
    // Créer un nouveau CodePromo
    router.post("/", codePromos.create);
  
    // Récupérer tous les CodePromos
    router.get("/", codePromos.findAll);
  
    // Récupérer un CodePromo par son ID
    router.get("/:id", codePromos.findOne);
  
    // Mettre à jour un CodePromo par son ID
    router.put("/:id", codePromos.update);
  
    // Supprimer un CodePromo par son ID
    router.delete("/:id", codePromos.delete);
  
    // Supprimer tous les CodePromos
    router.delete("/", codePromos.deleteAll);
  
    app.use('/api/codePromos', router);
};
