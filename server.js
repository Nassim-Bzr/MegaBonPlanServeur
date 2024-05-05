const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("./auth");
const app = express();
require('dotenv').config();
const multer = require('multer');
const path = require('path');




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

// Remplacez ces lignes si vous utilisez Sequelize et non directement pool
// const pool = require("./config/db.config.js");
var corsOptions = {
  origin: "*", // Autoriser toutes les origines
};

// Activation du middleware CORS avec les options configurées
// Importez vos routeurs
require("./routes/category.routes")(app);
require("./routes/bonplan.routes")(app);
require("./routes/commentary.routes")(app);
require("./routes/codepromos.routes")(app);
require("./routes/discussions.routes")(app);
require("./routes/utilisateur.routes")(app);


// Répétez pour d'autres entités en important leurs routeurs correspondants

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

/* app.get("/", (req, res) => {
  res.json({ message: "Bonsoir." });
});
 */

/* // Configuration de Multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/')  // Assurez-vous que ce dossier existe et est accessible en écriture
  },
  filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});


const upload = multer({ storage: storage }); */

/* app.post('/upload', upload.single('imglink'), (req, res) => {
  res.send('Fichier uploadé avec succès!');
}); */

app.get("/", (req, res) => {
  res.send('<a href="/auth/google"> Auth with google auth</a>');
});

app.get('/protected', isLoggedIn, (req, res) => {
  // Supposons que "http://localhost:3000" soit l'URL de base de votre front-end
  // Vous pouvez également utiliser process.env.CLIENT_URL pour cela
  const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
  
  // Redirigez vers le front-end avec des informations sur l'utilisateur
  res.redirect(`${baseUrl}/login-success?name=${req.user.displayName}`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
