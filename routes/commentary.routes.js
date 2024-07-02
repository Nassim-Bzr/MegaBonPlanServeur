// routes/commentaire.routes.js

module.exports = app => {
  const commentary = require("../controllers/commentary.controller.js");
  
  var router = require("express").Router();

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
  
  // Route pour liker un commentaire
  router.post("/like/:id_commentaire", checkAuth, commentary.likeComment);

  app.use('/api/commentary', router);
};
