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

// Créer un utilisateur (VERSION TEMPORAIRE SANS VÉRIFICATION EMAIL)
exports.create = async (req, res) => {
    try {
        const email = req.body.email;
        
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await Utilisateur.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).send({ message: "Cet email est déjà utilisé." });
        }

        const utilisateur = {
            nom: req.body.nom,
            email: email,
            motdepasse: await bcrypt.hash(req.body.motdepasse, 10),
            isadmin: req.body.isadmin || false
            // Colonnes de vérification temporairement supprimées
            // verificationcode: code,
            // verificationcodeexpires: new Date(Date.now() + 3600000),
            // isverified: true  // Auto-vérifié pour l'instant
        };

        console.log('Creating user without email verification (temporary)');
        const data = await Utilisateur.create(utilisateur);

        console.log('User created successfully:', data.email);

        res.status(201).send({
            id_utilisateur: data.id_utilisateur,
            nom: data.nom,
            email: data.email,
            isadmin: data.isadmin,
            message: "Utilisateur créé avec succès ! (Vérification email désactivée temporairement)"
        });
    } catch (err) {
        console.error("Error during user creation:", err);
        res.status(500).send({ message: err.message });
    }
};

// Méthode pour vérifier le code de l'utilisateur (TEMPORAIREMENT DÉSACTIVÉE)
exports.verifyUser = async (req, res) => {
    // Fonction temporairement désactivée car les colonnes de vérification n'existent pas
    res.send({ 
        message: "Vérification automatique activée (temporaire). Tous les comptes sont considérés comme vérifiés." 
    });
    
    /* ANCIEN CODE À RÉACTIVER APRÈS MIGRATION
    const { email, code } = req.body;
    try {
        console.log(`Verifying user with email: ${email} and code: ${code}`);
        const utilisateur = await Utilisateur.findOne({
            where: {
                email,
                verificationcodeexpires: {
                    [Op.gt]: new Date()
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
    */
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

        // Vérification temporairement désactivée
        // if (!utilisateur.isverified) {
        //     return res.status(401).send({ message: "Compte non vérifié. Veuillez vérifier votre compte.", verify: true });
        // }

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



exports.updatePassword = async (req, res) => {
  const id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  console.log(`Update password request for user ID: ${id}`);

  try {
    const user = await Utilisateur.findOne({ where: { id_utilisateur: id } });
    console.log(`Utilisateur trouvé : ${JSON.stringify(user, null, 2)}`); // Log supplémentaire

    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    // Vérification de l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.motdepasse);
    if (!isMatch) {
      console.log("Ancien mot de passe incorrect");
      return res.status(400).send({ message: "Ancien mot de passe incorrect." });
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour du mot de passe
    user.motdepasse = hashedPassword;
    await user.save();

    res.send({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du mot de passe :", err);
    res.status(500).send({
      message: err.message || "Une erreur est survenue lors de la mise à jour du mot de passe.",
    });
  }
};
