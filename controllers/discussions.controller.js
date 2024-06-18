// controllers/codePromo.controller.js

const db = require("../models");
const Discussions = db.discussions;

// Récupérer tous les codes promos
exports.findAll = async (req, res) => {
    try {
        const discussion = await Discussions.findAll(); 
        res.send(discussion);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Erreur lors de la récupération des codes promos." });
    }    
};

// Créer une nouvelle discussions :

exports.create = async (req, res) => {
    try {
        console.log("Requête reçue pour créer une discussion:", req.body); // Log de débogage

        const discussion = await Discussions.create({
            titre: req.body.titre,
            datecreation: req.body.datecreation,
            content: req.body.content,
            likes: req.body.likes,
            id_utilisateur: req.body.id_utilisateur,
            categoryId: req.body.categoryId
        });

        console.log("Discussion créée avec succès:", discussion); // Log de succès
        res.status(201).send(discussion);
    } catch (e) {
        console.error("Erreur lors de la création de la discussion:", e); // Log d'erreur détaillé
        res.status(500).send({ message: "Erreur lors de la création de la discussion." });
    }
};

