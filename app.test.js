const supertest = require("supertest");
const expect = require("expect");
const app = require("../app");
const db = require("../db");
const Person = require("../models/person");

const request = supertest(app);
const endpoint = "/api/persons";

describe(endpoint, () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  describe("GET /", () => {
    it("should return all persons", async () => {
      const titles = ["m1", "m2"];
      const persons = titles.map((title) => ({
        title,
      }));
      await Person.insertMany(persons);

      const res = await request.get(endpoint);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      titles.forEach((title) =>
        expect(res.body.some((m) => m.title === title))
      );

      await Person.deleteMany({ title: { $in: titles } });
    });
  });

  describe("POST /", () => {
    it("should return 400 if request is not valid", async () => {
      const res = await request.post(endpoint).send({});

      expect(res.status).toBe(400);
    });

    it("should store the person and return 201 if request is valid", async () => {
      const person = { title: "m" };

      const res = await request.post(endpoint).send(person);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(person.title);
      expect(res.body._id).toBeTruthy();

      await Person.findByIdAndDelete(res.body._id);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if person was not found", async () => {
      const res = await request.delete(endpoint);

      expect(res.status).toBe(404);
    });

    it("should delete the person and return 204", async () => {
      const person = new Person({ title: "m" });
      await person.save();

      const res = await request.delete(`${endpoint}/${person._id}`);

      expect(res.status).toBe(204);

      const personInDb = await Person.findById(person._id);
      expect(personInDb).toBeFalsy();
    });
  });
});
