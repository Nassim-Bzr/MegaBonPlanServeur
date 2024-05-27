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


const allowedOrigins = [
"https://mega-bon-plan-cgji.vercel.app",
"http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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
  res.send('<a href="/auth/google"> Auth with google auth</a>');
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

// Synchronisez la base de données et démarrez le serveur
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
