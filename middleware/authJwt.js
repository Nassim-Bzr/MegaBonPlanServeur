const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index");
const User = db.user;

// Middleware de vérification du jeton
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware pour vérifier le rôle d'administrateur
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

// Middleware pour vérifier le rôle de modérateur
isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

// Middleware pour vérifier le rôle de modérateur ou d'administrateur
isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

// Middleware pour authentifier l'utilisateur
const authenticateUser = async (req, res, next) => {
  try {
    // Obtenez l'utilisateur actuel à partir de l'ID stocké dans le jeton d'accès
    const userId = req.userId;
    const user = await User.findByPk(userId);

    // Vérifiez si l'utilisateur a le rôle "user"
    const hasUserRole = await user.hasRole("user");

    if (hasUserRole) {
      // L'utilisateur a le rôle "user"
      // Poursuivre le flux d'exécution
      next();
    } else {
      // L'utilisateur n'a pas le rôle "user"
      res.status(403).json({ message: "Access denied. You must have 'user' role." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while authenticating the user." });
  }
};

// Export des fonctions middleware d'authentification
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  authenticateUser: authenticateUser
};

module.exports = authJwt;