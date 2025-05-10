const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// MongoDB connection

mongoose.connect('mongodb://localhost:27017/tractorDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
// Mongoose Schema and Model
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: props => `${props.value} is not a valid 10-digit phone number`
    }
  },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  advance: {
    type: Number,
    required: true,
    min: [1000, 'Advance must be at least ₹1000']
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send(booking);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).send('Booking not found');
    res.send(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Booking not found');
    res.send({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Buy.html');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
