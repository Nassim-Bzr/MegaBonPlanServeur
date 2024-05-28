const db = require("../models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const Utilisateur = db.utilisateurs;

// Fonction pour générer un code de vérification
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

// Configurer le transporter pour Nodemailer avec SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME, // Ton email
    pass: process.env.EMAIL_APP_PASSWORD // Le mot de passe d'application
  }
});

// Fonction pour envoyer l'email de vérification
const sendVerificationEmail = (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Votre code de vérification',
    text: `Votre code de vérification est ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'email: ', error);
    } else {
      console.log('Email envoyé: ' + info.response);
    }
  });
};

// Créer un utilisateur avec isVerified à false
exports.create = async (req, res) => {
    try {
        const code = generateVerificationCode();
        const utilisateur = {
            nom: req.body.nom,
            email: req.body.email,
            motdepasse: await bcrypt.hash(req.body.motdepasse, 10),
            isadmin: req.body.isadmin || false,
            verificationcode: code,
            verificationcodeexpires: new Date(Date.now() + 3600000),
            isverified: false  // Utilisateur n'est pas encore vérifié
        };
        const data = await Utilisateur.create(utilisateur);
        sendVerificationEmail(req.body.email, code);
        res.status(201).send(data);
    } catch (err) {
        console.error("Error during user creation:", err);
        res.status(500).send({ message: err.message });
    }
};

// Méthode pour vérifier le code de l'utilisateur
exports.verifyUser = async (req, res) => {
    const { email, code } = req.body;
    try {
        const utilisateur = await Utilisateur.findOne({
            where: {
                email,
                verificationcodeexpires: {
                    [Op.gt]: new Date() // Utilisez Op.gt pour comparer les dates
                }
            }
        });
        if (!utilisateur) {
            return res.status(404).send({ message: "Utilisateur non trouvé ou code expiré." });
        }

        if (utilisateur.verificationcode === code) {
            utilisateur.isverified = true;
            await utilisateur.save();
            res.send({ message: "Compte vérifié avec succès !" });
        } else {
            res.status(400).send({ message: "Code de vérification incorrect." });
        }
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).send({ message: err.message });
    }
};

// Récupérer tous les utilisateurs
exports.findAll = async (req, res) => {
    try {
        const data = await Utilisateur.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la récupération des utilisateurs.",
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
            message: err.message || "Une erreur est survenue lors de la récupération de l'utilisateur.",
        });
    }
};

// Mettre à jour un utilisateur par son ID
exports.update = async (req, res) => {
    const id = req.params.id;

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
            message: err.message || "Une erreur est survenue lors de la suppression des utilisateurs.",
        });
    }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    const { email, motdepasse } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ where: { email } });

        if (!utilisateur) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        if (!utilisateur.isverified) {
            return res.status(401).send({ message: "Compte non vérifié. Veuillez vérifier votre compte.", verify: true });
        }

        const isMatch = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
        if (!isMatch) {
            return res.status(401).send({ message: "Mot de passe incorrect !" });
        }

        const payload = {
            user: {
                id: utilisateur.id_utilisateur,
                email: utilisateur.email,
                isadmin: utilisateur.isadmin,
                nom: utilisateur.nom,
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    user: payload.user,
                    token: token
                });
            }
        );
    } catch (err) {
        res.status(500).send({ message: err.message || "Une erreur est survenue lors de la tentative de connexion." });
    }
};
