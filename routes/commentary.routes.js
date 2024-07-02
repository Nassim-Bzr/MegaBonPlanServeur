module.exports = app => {
  const commentary = require("../controllers/commentary.controller.js");

  var router = require("express").Router();

  // Middleware pour vérifier si l'utilisateur est connecté
  const checkAuth = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).send({ message: "Non autorisé" });
    }
  };

  router.get("/bonplan/:id_bonplan", commentary.findByBonPlanId);
  router.post("/", commentary.create);
  router.delete("/:id", commentary.delete);
  router.delete("/", commentary.deleteAll);
  router.get("/", commentary.getAllcommentary);

  // Route pour ajouter un like à un commentaire
  router.post("/like", commentary.addLike);
  router.get("/:id_commentaire/likes", commentary.getLikes);

  app.use('/api/commentary', router);
};
