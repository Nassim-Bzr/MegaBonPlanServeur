module.exports = {
    HOST: "localhost",
    USER: "megabonplan",
    PASSWORD: "megabonplan",
    DB: "megabonplan",
    dialect: "postgres", // Spécifiez le dialecte ici
    pool: {
      max: 5, // Nombre maximum de connexions dans le pool
      min: 0, // Nombre minimum de connexions dans le pool
      acquire: 30000, // Le temps maximum, en millisecondes, que le pool va essayer d'obtenir une connexion avant de lancer une erreur
      idle: 10000 // Le temps maximum, en millisecondes, qu'une connexion peut rester inactive avant d'être relâchée
    }
  };
  