// controllers/codePromo.controller.js

const db = require("../models");
const CodePromo = db.CodePromo;

// Récupérer tous les codes promos
exports.findAll = async (req, res) => {
    try {
        const codepromos = await CodePromo.findAll(); 
        res.send(codepromos);
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

    const codePromo = {
        code: req.body.code,
        description: req.body.description,
        dateexpiration: req.body.dateexpiration,
        approuvéparadmin: req.body.approuvéparadmin,
        marchand: req.body.marchand,
        imgmarchand: req.body.imgmarchand,
        reduction: req.body.reduction,
        montant: req.body.montant,
    };

    try {
        const data = await CodePromo.create(codePromo);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Erreur lors de la création du code promo."
        });
    }
};

// Trouver un code promo par son ID
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const codePromo = await CodePromo.findByPk(id);
        if (codePromo) {
            res.send(codePromo);
        } else {
            res.status(404).send({ message: `Aucun code promo trouvé avec l'ID ${id}.` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Erreur lors de la récupération du code promo avec l'ID " + id
        });
    }
};

// Mettre à jour un code promo par son ID
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await CodePromo.update(req.body, { where: { id_codepromo: id } });
        if (num == 1) {
            res.send({ message: "Code promo mis à jour avec succès." });
        } else {
            res.send({ message: `Impossible de mettre à jour le code promo avec l'ID=${id}. Peut-être que le code promo n'a pas été trouvé ou req.body est vide!` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Erreur lors de la mise à jour du code promo avec l'ID " + id
        });
    }
};

// Supprimer un code promo par son ID
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await CodePromo.destroy({ where: { id_codepromo: id } });
        if (num == 1) {
            res.send({ message: "Code promo supprimé avec succès!" });
        } else {
            res.send({ message: `Impossible de supprimer le code promo avec l'ID=${id}. Peut-être que le code promo n'a pas été trouvé!` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Impossible de supprimer le code promo avec l'ID " + id
        });
    }
};

// Supprimer tous les codes promos
exports.deleteAll = async (req, res) => {
    try {
        const nums = await CodePromo.destroy({ where: {}, truncate: false });
        res.send({ message: `${nums} Codes promos ont été supprimés avec succès!` });
    } catch (err) {
        res.status(500).send({
            message: "Une erreur est survenue lors de la suppression de tous les codes promos."
        });
    }
};
