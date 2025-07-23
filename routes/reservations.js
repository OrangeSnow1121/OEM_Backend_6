
const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { verifyToken } = require("./auth");

// GET reservations for a specific date (date-range aware)
router.get("/:date", verifyToken, async (req, res) => {
  try {
    const inputDate = new Date(req.params.date);
    const nextDate = new Date(inputDate);
    nextDate.setDate(inputDate.getDate() + 1);

    const reservations = await Reservation.find({
      date: { $gte: inputDate, $lt: nextDate }
    });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST a new reservation (Admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { site, date, timeSlot, note } = req.body;
    const newReservation = new Reservation({
      site,
      date: new Date(date),
      timeSlot,
      note
    });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ message: "Failed to create reservation", error: err.message });
  }
});

module.exports = router;
