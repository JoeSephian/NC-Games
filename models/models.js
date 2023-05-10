const db = require("../db/connection");

exports.allCategories = () => {
  return db
    .query(
      `
    SELECT slug, description FROM categories;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.returnReview = (review_id) => {
  return db
    .query(
      `
    SELECT *
    FROM reviews
    WHERE review_id = $1;
`,
      [review_id]
    )
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "404 - not found"})
        }
      return rows[0];
    });
};
