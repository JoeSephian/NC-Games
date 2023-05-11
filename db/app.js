const express = require("express");

const {
  getCategories,
  getEndpoints,
  getReview,
  getReviews,
  getComments,
} = require("../controllers/controllers");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400 - bad request" });
  } else {
    next(err);
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "404 - not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500 - internal server error" });
});

module.exports = app;
