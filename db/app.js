const express = require("express");

const { getCategories } = require("../controllers/controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
    res.status(500).send({ msg: '500 - internal server error'})
})

app.all('/*', (req, res, next) => {
    res.status(404).send({ msg: '404 - not found' });
    
})

module.exports = app;
