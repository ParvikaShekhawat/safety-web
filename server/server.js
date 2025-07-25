const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Mongoose User Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  phoneNumber: String,
});

const User = mongoose.model('User', userSchema);

// ========================
// ✅ Register Endpoint
// POST /api/auth/register
// ========================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phoneNumber });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// ✅ Login Endpoint
// POST /api/auth/login
// ========================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// ✅ Reset Endpoint (Mock)
// POST /api/auth/reset
// ========================
app.post('/api/auth/reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // In real apps, send a real reset email (with nodemailer)
    res.json({ message: 'Password reset link sent (mock)' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Load from environment or config
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_FROM;

const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// 👇 Main SOS route
app.post('/api/sos', async (req, res) => {
  try {
    const { contacts, message } = req.body;

    if (!contacts || !contacts.length) {
      return res.status(400).json({ message: 'No contacts provided' });
    }

    const results = [];
    for (const contact of contacts) {
      if (!contact.number) continue;

      const sms = await twilioClient.messages.create({
        to: contact.number,
        from: TWILIO_PHONE,
        body: message,
      });

      results.push({ to: contact.number, sid: sms.sid });
    }

    return res.json({ success: true, sent: results.length });
  } catch (err) {
    console.error('SOS error:', err);
    res.status(500).json({ message: 'Failed to send SOS',error: err.message  });
  }
});

// ========================
// ✅ Start Server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
