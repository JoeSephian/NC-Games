const { allCategories, returnReview } = require("../models/models");

exports.getCategories = (req, res, next) => {
  const { slug, description } = req.query;
  allCategories(slug, description)
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  const {
    title,
    review_body,
    designer,
    review_img_url,
    votes,
    category,
    owner,
    created_at,
  } = req.query;
  return returnReview(
    review_id,
    title,
    review_body,
    designer,
    review_img_url,
    votes,
    category,
    owner,
    created_at
  )
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err)
    });
};
