const {
  allCategories,
  returnReview,
  allReviews,
  allComments,
  updateVotes
} = require("../models/models");
const endpoints = require("../endpoints.json");

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
  return returnReview(review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  return allReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  return allComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params
  const { inc_votes } = req.query
  return updateVotes(inc_votes, review_id)
  .then((update) => {
    res.status(200).send(update[0])
  })
  .catch(next)
}

exports.getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints);
};
