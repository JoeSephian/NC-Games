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
        return Promise.reject({
          status: 404,
          msg: "404 - not found",
        });
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

exports.allComments = (review_id) => {
  const queryStr = `
  SELECT * FROM comments
  WHERE review_ID = $1
  ORDER BY created_at DESC;
  `;
  const queryValues = [review_id];
  return exports.returnReview(review_id)
    .then(() => {
      return db.query(queryStr, queryValues);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "This review has no comments",
        });
      }
      return rows;
    });
};

exports.createComment = (newComment, review_id) => {
  const { body, author } = newComment;
  const postCommentQuery = `
  INSERT INTO comments
  (body, author, review_id)
  VALUES
  ($1, $2, $3)
  RETURNING *;`;
  const queryValues = [body, author, review_id];
  return exports
    .returnReview(review_id)
    .then(() => {
      return db.query(postCommentQuery, queryValues);
    })
    .then(({ rows }) => {
      return rows[0];
    })
};

exports.updateVotes = (inc_votes, review_id) => {
  const queryStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `
  // return exports.returnReview(review_id)
  // .then(() =>{
    return db
  .query(queryStr, [inc_votes, review_id])
  // }
  // )
  .then(({ rows }) => {
    return rows;
  })
}