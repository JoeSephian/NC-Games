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
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 - not found" });
      }
      return rows[0];
    });
};

exports.allReviews = (sort_by = "created_at", order = "DESC") => {
  return db
    .query(
      `
    SELECT a.owner, a.title, a.review_id, a.category, a.review_img_url, a.created_at, a.votes, a.designer, CAST(COALESCE(b.count, 0) AS INTEGER) AS comment_count
    FROM reviews a
    LEFT OUTER JOIN(SELECT COUNT(body) as count, review_ID
        FROM comments
        GROUP by review_ID ) b
      ON a.review_ID=b.review_ID
    ORDER BY ${sort_by} ${order};
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
