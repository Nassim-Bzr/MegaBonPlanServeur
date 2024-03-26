module.exports = app => {
    const commentary = require ("../controllers/commentary.controller.js");
    
var router = require("express").Router();

// Create a new Commentary
router.post("/", commentary.create);

app.use('/api/commentary',router);
}