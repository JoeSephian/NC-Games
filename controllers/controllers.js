const { allCategories, allEndpoints } = require("../models/models");
const fs = require('fs')

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
  fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (err, data) => {
    if (err) {
      console.log(err)
    }
    res.json(JSON.parse(data))
  })
}