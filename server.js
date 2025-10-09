// App using Mongo as Database

const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const { MongoClient } = require("mongodb");
const MONGODB_URI = process.env.MONGO_DB_URI;
let db;
MongoClient.connect(MONGODB_URI)
  .then((client) => {
    console.log("✅ Connected to MongoDB");
    db = client.db("superhero-db");
  })

  .catch((error) => console.error("❌ MongoDB Error", error));

function getHeroesCollection() {
  if (!db) throw new Error("Database not initialized");
  return db.collection("heroes");
}

//Create POST Route

app.post("/heroes", async (req, res) => {
  try {
    const newHero = {
      superName: req.body.superName,
      realName: req.body.realName,
      superpower: req.body.superpower,
      powerLevel: parseInt(req.body.powerLevel),
      desc: req.body.desc,
      secretIdentity: req.body.secretIdentity === "true",
      createdAt: new Date().toISOString(),
    };
    const collection = getHeroesCollection();
    const result = await collection.insertOne(newHero);
    res.status(201).json({
      success: true,
      message: "Hero created successfully!",
      redirectTo: "/heroes",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//Create read GET route
app.get("/heroes", async (req, res) => {
  try {
    const collection = getHeroesCollection();
    const heroes = await collection.find().toArray();
    const heroesWithStringIds = heroes.map((h) => ({
      ...h,
      _id: h._id.toString(),
    }));
    if (req.accepts("html")) {
      res.render("heroList", { heroes });
    } else {
      res.json({ success: true, count: heroes.length, data: heroes });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const { ObjectId } = require("mongodb");

app.put("/heroes/:id", async (req, res) => {
  try {
    const heroId = req.params.id;
    if (!ObjectId.isValid(heroId)) {
      return res.status(400).json({ success: false, error: "Invalid hero ID" });
    }

    const updateFields = {
      superName: req.body.superName,
      realName: req.body.realName,
      superpower: req.body.superpower,
      powerLevel: parseInt(req.body.powerLevel),
      desc: req.body.desc,
      secretIdentity: req.body.secretIdentity === "true",
      updatedAt: new Date(),
    };

    const collection = getHeroesCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(heroId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ success: false, error: "Hero not found" });
    }

    res.json({ success: true, data: result.value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/heroes/:id", async (req, res) => {
  try {
    const heroId = req.params.id;
    if (!ObjectId.isValid(heroId)) {
      return res.status(400).json({ success: false, error: "Invalid hero ID" });
    }

    const collection = getHeroesCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(heroId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Hero not found" });
    }

    res.json({ success: true, message: "Hero deleted" });
  } catch (error) {
    console.log("Error Occured", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Form Route
app.get("/", (req, res) => {
  const heroFields = require("./config/heroInputs.config.js");
  res.render("heroForm", heroFields);
});

//MongoDB Migration

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
