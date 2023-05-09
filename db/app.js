const express = require("express");

const { getCategories } = require("../controllers/controllers");

const app = express();

app.get("/api/categories", getCategories);

app.all('/*', (req, res, next) => {
    res.status(404).send({ msg: '404 - not found' });
})

module.exports = app;
