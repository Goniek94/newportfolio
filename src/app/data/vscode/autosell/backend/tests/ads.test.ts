export const adsTestCode = `const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Ad = require("../models/ad");

// Seed data used across tests
const mockAd = {
  title: "BMW 3 Series 2020",
  price: 85000,
  category: "osobowe",
  fuel: "benzyna",
  mileage: 42000,
  location: "Warsaw",
  status: "active",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  await Ad.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

// ─────────────────────────────────────────────
// GET /api/ads — search & filter
// ─────────────────────────────────────────────

describe("GET /api/ads", () => {
  beforeEach(async () => {
    await Ad.create([
      mockAd,
      { ...mockAd, title: "Audi A4 2019", price: 72000, fuel: "diesel" },
      { ...mockAd, title: "Toyota Corolla 2021", price: 55000, status: "sold" },
    ]);
  });

  it("returns only active listings by default", async () => {
    const res = await request(app).get("/api/ads");

    expect(res.status).toBe(200);
    expect(res.body.ads).toHaveLength(2);
    res.body.ads.forEach((ad) => {
      expect(ad.status).toBe("active");
    });
  });

  it("filters by price range", async () => {
    const res = await request(app)
      .get("/api/ads")
      .query({ priceMin: 70000, priceMax: 90000 });

    expect(res.status).toBe(200);
    expect(res.body.ads).toHaveLength(2);
    res.body.ads.forEach((ad) => {
      expect(ad.price).toBeGreaterThanOrEqual(70000);
      expect(ad.price).toBeLessThanOrEqual(90000);
    });
  });

  it("filters by fuel type", async () => {
    const res = await request(app).get("/api/ads").query({ fuel: "diesel" });

    expect(res.status).toBe(200);
    expect(res.body.ads).toHaveLength(1);
    expect(res.body.ads[0].title).toBe("Audi A4 2019");
  });

  it("returns pagination metadata", async () => {
    const res = await request(app).get("/api/ads").query({ page: 1, limit: 1 });

    expect(res.status).toBe(200);
    expect(res.body.ads).toHaveLength(1);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
  });
});

// ─────────────────────────────────────────────
// POST /api/ads — create listing
// ─────────────────────────────────────────────

describe("POST /api/ads", () => {
  it("returns 401 if user is not authenticated", async () => {
    const res = await request(app).post("/api/ads").send(mockAd);

    expect(res.status).toBe(401);
  });

  it("returns 400 if required fields are missing", async () => {
    const token = global.__AUTH_TOKEN__; // set in jest.setup.js
    const res = await request(app)
      .post("/api/ads")
      .set("Authorization", \`Bearer \${token}\`)
      .send({ title: "Missing fields" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("creates a listing and returns it", async () => {
    const token = global.__AUTH_TOKEN__;
    const res = await request(app)
      .post("/api/ads")
      .set("Authorization", \`Bearer \${token}\`)
      .send(mockAd);

    expect(res.status).toBe(201);
    expect(res.body.ad.title).toBe(mockAd.title);
    expect(res.body.ad.status).toBe("active");
    expect(res.body.ad).toHaveProperty("_id");
  });
});
`;
