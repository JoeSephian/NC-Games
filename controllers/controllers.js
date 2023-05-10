const { allCategories, returnReview } = require("../models/models");

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
