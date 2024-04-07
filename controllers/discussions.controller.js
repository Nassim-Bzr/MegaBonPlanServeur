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

// Créer un nouveau code promo
exports.create = async (req, res) => {
    if (!req.body.code) {
        res.status(400).send({ message: "Le code ne peut pas être vide !" });
        return;
    }

    const discussion = {
        Titre: req.body.titre,
        Contenu: req.body.contenu,
        dateexpiration: req.body.dateexpiration
    };

    try {
        const data = await Discussions.create(discussion);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Erreur lors de la création du code promo."
        });
    }
};
