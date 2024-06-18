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
    console.log("Requête reçue pour créer une discussion:", req.body);

    if (!req.body.titre || !req.body.content || !req.body.id_utilisateur || !req.body.id_category) {
        return res.status(400).send({ message: "Tous les champs sont requis: titre, contenu, id_utilisateur, id_category" });
    }

    const discussion = {
        titre: req.body.titre,
        content: req.body.content,
        likes: req.body.likes || 0,
        id_utilisateur: req.body.id_utilisateur,
        id_category: req.body.id_category
    };

    try {
        const data = await Discussions.create(discussion);
        res.status(201).send(data);
    } catch (e) {
        console.error("Erreur lors de la création de la discussion:", e);
        res.status(500).send({
            message: "Erreur lors de la création de la discussion.",
            error: e.message,
            stack: e.stack
        });
    }
};


