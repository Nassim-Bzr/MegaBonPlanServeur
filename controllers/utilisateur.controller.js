const nodemailer = require("nodemailer");
const db = require("../models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const Utilisateur = db.utilisateurs;

// Fonction pour générer un code de vérification
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex'); // Génère un code hexadécimal
};

// Configuration du transporter pour NodeMailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Fonction pour envoyer l'email de vérification
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Verification de votre compte",
    html: `<h1>Code de Vérification</h1><p>Votre code de vérification est: ${code}</p>`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// Créer un utilisateur
exports.create = async (req, res) => {
  try {
    const code = generateVerificationCode();
    const utilisateur = {
      nom: req.body.nom,
      email: req.body.email,
      motdepasse: await bcrypt.hash(req.body.motdepasse, 10),
      isadmin: req.body.isadmin || false,
      verificationcode: code,
      verificationcodeexpires: new Date(Date.now() + 3600000)
    };

    const data = await Utilisateur.create(utilisateur);
    await sendVerificationEmail(req.body.email, code);
    res.status(201).send(data);
  } catch (err) {
    console.error("Error during user creation:", err);
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la création de l'utilisateur."
    });
  }
};
// Récupérer tous les utilisateurs
exports.findAll = async (req, res) => {
    try {
        const data = await Utilisateur.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message ||
                "Une erreur est survenue lors de la récupération des utilisateurs.",
        });
    }
};

// Récupérer un utilisateur par son ID
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Utilisateur.findByPk(id);
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({ message: "Utilisateur non trouvé." });
        }
    } catch (err) {
        res.status(500).send({
            message:
                err.message ||
                "Une erreur est survenue lors de la récupération de l'utilisateur.",
        });
    }
};

// Mettre à jour un utilisateur par son ID
exports.update = async (req, res) => {
    const id = req.params.id;  // Assure-toi que le paramètre dans la route est correctement nommé

    try {
        const [updatedRows] = await Utilisateur.update(req.body, {
            where: { id_utilisateur: id },
        });

        if (updatedRows === 1) {
            res.send({ message: "Utilisateur mis à jour avec succès." });
        } else {
            res.status(404).send({ message: "Utilisateur non trouvé." });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
        });
    }
};



// Supprimer un utilisateur par son ID
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const utilisateur = await Utilisateur.findByPk(id);

        if (!utilisateur) {
            return res.status(404).send({
                message: `L'utilisateur avec l'ID ${id} n'a pas été trouvé.`
            });
        }

        await utilisateur.destroy();

        res.send({ message: `L'utilisateur avec l'ID ${id} a été supprimé avec succès !` });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la suppression de l'utilisateur."
        });
    }
};
 
// Supprimer tous les utilisateurs

exports.deleteAll = async (req, res) => {
    try {
        const deletedRows = await Utilisateur.destroy({
            where: {},
            truncate: false,
        });

        res.send({
            message: `${deletedRows} Utilisateurs supprimés avec succès.`,
        });
    } catch (err) {
        res.status(500).send({
            message:
                err.message ||
                "Une erreur est survenue lors de la suppression des utilisateurs.",
        });
    }
}
// Connexion d'un utilisateur
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, motdepasse } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ where: { email } });

        if (!utilisateur) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        const isMatch = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
        if (!isMatch) {
            return res.status(401).send({ message: "Mot de passe incorrect !" });
        }

        const payload = {
            user: {
                id: utilisateur.id,
                email: utilisateur.email,
                isadmin: utilisateur.isadmin,
                nom: utilisateur.nom,
                token: utilisateur,
            }
        };

        // Expire dans 1 heure
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Assurez-vous de définir cette variable d'environnement
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    user: payload.user, // Inclure les données de l'utilisateur dans la réponse
                    token: token
                });
            }
        );
    } catch (err) {
        res.status(500).send({ message: err.message || "Une erreur est survenue lors de la tentative de connexion." });
    }
};

