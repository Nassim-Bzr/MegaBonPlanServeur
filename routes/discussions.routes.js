// discussions routes

module.exports = app => {
    const discussions = require("../controllers/discussions.controller.js");
  
    var router = require("express").Router();
  
    // Créer un nouvel utilisateur
    router.post("/", discussions.create);
  
    // Récupérer tous les discussions
    router.get("/", discussions.findAll);
  
  // get one discussions 

  router.get("/:id", discussions.findOne);
   
  
    app.use('/api/discussions', router);
  }