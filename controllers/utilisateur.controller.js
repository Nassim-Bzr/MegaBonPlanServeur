require('dotenv').config();
const db = require("../models");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sendVerificationEmail } = require('../mailer'); // Assurez-vous que le chemin est correct

const Utilisateur = db.utilisateurs;

// Fonction pour générer un code de vérification
const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex'); // Génère un code hexadécimal
};

// Créer un utilisateur avec isVerified à false
exports.create = async (req, res) => {
    try {
        const email = req.body.email;
        
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await Utilisateur.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).send({ message: "Cet email est déjà utilisé." });
        }

        const code = generateVerificationCode();
        const utilisateur = {
            nom: req.body.nom,
            email: email,
            motdepasse: await bcrypt.hash(req.body.motdepasse, 10),
            isadmin: req.body.isadmin || false,
            verificationcode: code,
            verificationcodeexpires: new Date(Date.now() + 3600000), // 1 heure
            isverified: false  // Utilisateur n'est pas encore vérifié
        };

        console.log('Creating user with verification code:', code);
        const data = await Utilisateur.create(utilisateur);

        console.log('User created:', data);

        // Envoyer l'email de vérification
        const emailSubject = 'Votre code de vérification';
        const emailBody = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="text-align: center; color: #4CAF50;">MegaBonPlan</h1>
          <p>Bonjour,</p>
          <p>Voici votre code de vérification pour votre compte MegaBonPlan :</p>
          <div style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code doit uniquement être utilisé pour vérifier votre compte sur notre site.</p>
          <p>Merci de votre confiance et à bientôt sur <a href="https://megabonplan-f8522b195111.herokuapp.com">MegaBonPlan</a>.</p>
          <hr>
          <p style="font-size: 12px; color: #777;">Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
        </div>`;

        console.log('Sending verification email to:', email);
        console.log('Email subject:', emailSubject);
        console.log('Email body:', emailBody);

        // Ajoutez un bloc try-catch pour capturer et loguer les erreurs d'envoi d'email
        try {
            await sendVerificationEmail(email, emailSubject, emailBody);
            console.log('Verification email sent successfully');
        } catch (emailErr) {
            console.error('Error sending verification email:', emailErr);
            return res.status(500).send({ message: 'Erreur lors de l\'envoi de l\'email de vérification.' });
        }

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
        console.log(`Verifying user with email: ${email} and code: ${code}`);
        const utilisateur = await Utilisateur.findOne({
            where: {
                email,
                verificationcodeexpires: {
                    [Op.gt]: new Date() // Utilisez Op.gt pour comparer les dates
                }
            }
        });

        if (!utilisateur) {
            console.log('Utilisateur non trouvé ou code expiré.');
            return res.status(404).send({ message: "Utilisateur non trouvé ou code expiré." });
        }

        console.log(`Found user: ${utilisateur.email} with verification code: ${utilisateur.verificationcode}`);

        if (utilisateur.verificationcode === code) {
            utilisateur.isverified = true;
            await utilisateur.save();
            res.send({ message: "Compte vérifié avec succès !" });
        } else {
            console.log('Code de vérification incorrect.');
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
            res.status(404).send({ message: "Utilisateur non trouvée." });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la récupération de l'utilisateur.",
        });
    }
};

// Mettre à jour un utilisateur par son ID
// utilisateur.controller.js
// error change password
exports.update = async (req, res) => {
    const id = req.params.id;
    console.log(`Update request for user ID: ${id}`);
  
    try {
      const user = await Utilisateur.findOne({ where: { id_utilisateur: id } });
      console.log(`Utilisateur trouvé : ${user}`); // Log supplémentaire
  
      if (!user) {
        console.log("Utilisateur non trouvee");
        return res.status(404).send({ message: "Utilisateur non trouvéee." });
      }
  
      console.log('Données de la requête:', req.body);


  
      const [updatedRows] = await Utilisateur.update(req.body, {
        where: { id_utilisateur: id },
      });

  
      if (updatedRows === 1) {
        res.send({ message: "Utilisateur mis à jour avec succès." });
      } else {
        res.status(404).send({ message: "Utilisateur non trouvéee." });
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
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
