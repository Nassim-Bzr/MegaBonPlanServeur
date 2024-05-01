const db = require("../models");
const bcrypt = require('bcrypt');
const Utilisateur = db.utilisateurs;
require('dotenv').config();


// Créer un utilisateur
exports.create = async (req, res) => {
    try {
        // Valider la requête
        if (!req.body.email) {
            return res
                .status(400)
                .send({ message: "Le contenu ne peut pas être vide !" });
        }

        // Créer un nouvel utilisateur
        const utilisateur = {

            nom: req.body.nom,
            email: req.body.email,
            motdepasse: req.body.motdepasse,
            isadmin: req.body.isadmin,
        };

        // Sauvegarder l'utilisateur dans la base de données
        const data = await Utilisateur.create(utilisateur);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message ||
                "Une erreur est survenue lors de la création de l'utilisateur.",
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
    const id = req.params.id;

    try {
        const [updatedRows] = await Utilisateur.update(req.body, {
            where: { id: id },
        });

        if (updatedRows === 1) {
            res.send({ message: "Utilisateur mis à jour avec succès." });
        } else {
            res.status(404).send({ message: "Utilisateur non trouvé." });
        }
    } catch (err) {
        res.status(500).send({
            message:
                err.message ||
                "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
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

