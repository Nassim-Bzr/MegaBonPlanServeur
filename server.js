const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("./auth");
const app = express();
app.use(session({ secret: "cats" }));
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
app.get("/", (req, res) => {
  res.send('<a href="/auth/google"> Auth with google auth</a>');
});

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
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
