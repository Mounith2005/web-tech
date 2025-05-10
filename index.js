const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/tractorBookings", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  model: String,
  price: Number,
  advance: Number
});

const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

app.post("/api/bookings", async (req, res) => {
  const newBooking = new Booking(req.body);
  await newBooking.save();
  res.status(201).json(newBooking);
});

app.put("/api/bookings/:id", async (req, res) => {
  const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBooking);
});

app.delete("/api/bookings/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
