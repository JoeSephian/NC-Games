const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
const jsonFile = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());
describe("getCategories", () => {
  it("GET - status: 200 - responds with all categories, including slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).toBe(4);
        res.body.categories.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});

describe("getReview", () => {
  it("GET - status: 200 - responds with a single review", () => {
    return request(app)
      .get(`/api/reviews/2`)
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
        expect(res.body.review_id).toBe(2);
        expect(res.body.title).toBe("Jenga");
      });
  });
  it("GET - status: 400 - if given an invalid id type", () => {
    return request(app)
      .get(`/api/reviews/notanid`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("400 - bad request");
      });
  });
  it("GET - status: 404 - if given a valid id but returning no results", () => {
    return request(app)
      .get(`/api/reviews/200`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - not found");
      });
  });
});

describe("getReviews", () => {
  it("GET - status: 200 - array of reviews is returned with the correct properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
        res.body.reviews.forEach((review) => {
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.designer).toBe("string");
        });
      });
  });
  it("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should not contain review_body property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        res.body.reviews.forEach((review) => {
          expect(review.hasOwnProperty("review_body")).toBe(false);
        });
      });
  });
  it("should return a comment_count column", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews[0].review_id).toBe(7);
        expect(res.body.reviews[0].comment_count).toBe(0);
        expect(res.body.reviews[7].review_id).toBe(2);
        expect(res.body.reviews[7].comment_count).toBe(3);
        res.body.reviews.forEach((review) => {
          expect(typeof review.comment_count).toBe("number");
        });
      });
  });
});

describe("getComments", () => {
  it("GET - status: 200 - responds with all comments for a review", () => {
    return request(app)
      .get(`/api/reviews/2/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments.length).toBe(3);
        res.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
        });
      });
  });
  it("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("GET - status: 400 - if given an invalid id type", () => {
    return request(app)
      .get(`/api/reviews/notavalidid/comments`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("400 - bad request");
      });
  });
  it("GET - status: 404 - if given a valid id but returning no results", () => {
    return request(app)
      .get(`/api/reviews/200/comments`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - not found");
      });
  });
  it('GET - status: 200 - if given a valid article with no comments', () => {
    return request(app)
    .get(`/api/reviews/7/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("This review has no comments");
      });
  });
});

describe("get API endpoints", () => {
  it("GET - status: 200 - responds with all api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
        expect(res.body).toEqual(jsonFile);
        expect(typeof res.body["GET /api"].description).toBe("string");
      });
  });
});

describe("404 error handling", () => {
  it("should return 404 if incorrect endpoint", () => {
    return request(app)
      .get("/api/notavalidurl")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 - not found");
      });
  });
});
