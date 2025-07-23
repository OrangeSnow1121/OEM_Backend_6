const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

router.post("/", verifyToken, async (req, res) => {
  try {
    const newReservation = new Reservation({ ...req.body, user: req.user.id });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("user", "username");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:date", async (req, res) => {
  try {
    const reservations = await Reservation.find({ date: req.params.date });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
