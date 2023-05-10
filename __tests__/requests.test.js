const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
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

describe("getReviews", () => {
  it("GET - status: 200 - responds with a single review", () => {
    return request(app)
      .get(`/api/reviews/2`)
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object")
        expect(res.body.review_id).toBe(2)
        expect(res.body.title).toBe('Jenga')
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
  it('GET - status: 404 - if given a valid id but returning no results', () => {
    return request(app)
    .get(`/api/reviews/200`)
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("404 - not found")
    })
  });
});
