require('dotenv').config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("./auth");
const app = express();
const multer = require('multer');
const path = require('path');
const db = require('./models'); // Importez les modèles
const favorisRoutes = require('./routes/favoris.routes');


const corsOptions = {
  origin: ['http://localhost:3000', 'https://votre-frontend-url.com'], // Ajoutez vos domaines autorisés
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'], // Ajoutez les headers nécessaires
};

app.use(session({
  secret: 'votre secret',
  resave: false,
  saveUninitialized: true,  // Définissez explicitement cette option selon vos besoins
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));


// Importez vos routeurs
require("./routes/category.routes")(app);
require("./routes/bonplan.routes")(app);
require("./routes/commentary.routes")(app);
require("./routes/codepromos.routes")(app);
require("./routes/discussions.routes")(app);
require("./routes/utilisateur.routes")(app);
require("./routes/favoris.routes")(app);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accueil - Mega Bon Plan</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #ece9e6, #ffffff);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        a {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          text-decoration: none;
          color: white;
          background: #4285F4;
          border-radius: 5px;
          transition: background 0.3s;
        }
        a:hover {
          background: #357AE8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bienvenue sur Mega Bon Plan</h1>
        <p>Connectez-vous pour découvrir les meilleures offres et bons plans.</p>
        <a href="/auth/google">Se connecter avec Google</a>
      </div>
    </body>
    </html>
  `);
});


app.get('/protected', isLoggedIn, (req, res) => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${baseUrl}/login-success?name=${req.user.displayName}`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

const PORT = process.env.PORT || 8080;

// Démarrer le serveur directement sans synchronisation (les tables existent déjà)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Optionnel: Tester la connexion sans synchronisation
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Servir les fichiers statiques du dossier uploads
