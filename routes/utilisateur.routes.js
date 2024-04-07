// utilisateurs routes

module.exports = app => {
  const utilisateurs = require("../controllers/utilisateur.controller.js");

  var router = require("express").Router();

/*   // Créer un nouvel utilisateur
  router.post("/", utilisateurs.create); */

  // Récupérer tous les utilisateurs
  router.get("/", utilisateurs.findAll);

  // Récupérer un utilisateur par son ID
/*   router.get("/:id", utilisateurs.findOne); */

  // Mettre à jour un utilisateur par son ID
/*   router.put("/:id", utilisateurs.update); */

/*   // Supprimer un utilisateur par son ID
  router.delete("/:id", utilisateurs.delete); */

/*   // Supprimer tous les utilisateurs
  router.delete("/", utilisateurs.deleteAll);  */

  app.use('/utilisateurs', router);
}