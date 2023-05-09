const { allCategories } = require("../models/models");

exports.getCategories = (req, res, next) => {
  const { slug, description } = req.query;
  allCategories(slug, description)
    .then((categories) => {
        console.log(categories)
      res.status(200).send({ categories });
    })
    .catch((err) => {
        console.log(err, '<<< this is error')
    })
};
