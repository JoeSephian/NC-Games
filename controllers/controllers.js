const { allCategories, allEndpoints } = require("../models/models");
const endpoints = require('../endpoints.json')

console.log(endpoints)
exports.getCategories = (req, res, next) => {
  const { slug, description } = req.query;
  allCategories(slug, description)
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
        console.log(err)
    })
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints)
}