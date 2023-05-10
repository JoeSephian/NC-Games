const { allCategories, allEndpoints, returnReview } = require("../models/models");
const endpoints = require('../endpoints.json')

console.log(endpoints)
exports.getCategories = (req, res, next) => {
  const { slug, description } = req.query;
  allCategories(slug, description)
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  return returnReview(review_id, [req.query]  )
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints)
}