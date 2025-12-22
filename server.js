require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'https://www.dhronepredicts.com',
    'https://dhronepredicts.com',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Prediction Schema
const predictionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  match: { type: String, required: true },
  leagueType: String,
  prediction: { type: String, required: true },
  odds: String,
  probability: String,
  category: { type: String, required: true },
  date: String,
  time: String,
  status: { type: String, default: 'Pending' },
  featured: { type: Boolean, default: false },
  note: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Categories
const categories = [
  'freeTips',
  'bankerTips',
  'free2Odds',
  'superSingle',
  'doubleChance',
  'over1.5Goals',
  'over2.5Goals',
  'overUnder3.5Goals',
  'btts',
  'overCorners',
  'correctScores',
  'draws',
  'vvip'
];

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // For now, we'll use a simple token check
    // In production, use proper JWT or session management
    if (token === 'admin-token') {
      return next();
    }
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Hardcoded credentials
  if (email === 'admin@dhronepredicts.com' && password === 'dhrone123') {
    res.json({
      success: true,
      token: 'admin-token',
      user: { email: 'admin@dhronepredicts.com', name: 'Admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  res.json({ success: true, user: { email: 'admin@dhronepredicts.com', name: 'Admin' } });
});

// API routes
app.get('/api/predictions', async (req, res) => {
  try {
    const { category, status } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    const predictions = await Prediction.find(query).sort({ createdAt: -1 });
    res.json(category ? predictions : predictions.reduce((acc, pred) => {
      if (!acc[pred.category]) acc[pred.category] = [];
      acc[pred.category].push(pred);
      return acc;
    }, {}));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/predictions', authenticate, async (req, res) => {
  try {
    const { category } = req.body;
    if (!category || !categories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const prediction = new Prediction({
      id: uuidv4(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await prediction.save();
    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/predictions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, ...updateData } = req.body;

    if (!category || !categories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const prediction = await Prediction.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/predictions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrediction = await Prediction.findOneAndDelete({ id });

    if (!deletedPrediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json({ success: true, deleted: deletedPrediction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Migration endpoint - call this once after deployment to import existing data
app.post('/api/migrate', authenticate, async (req, res) => {
  try {
    const fs = require('fs-extra');
    const path = require('path');
    const { v4: uuidv4 } = require('uuid');

    const dataDir = path.join(__dirname, 'data');
    let migratedCount = 0;

    for (const category of categories) {
      const filePath = path.join(dataDir, `${category}.json`);

      if (await fs.pathExists(filePath)) {
        console.log(`Migrating ${category}...`);
        const predictions = await fs.readJson(filePath);

        for (const pred of predictions) {
          // Check if prediction already exists
          const existing = await Prediction.findOne({ id: pred.id });
          if (!existing) {
            const newPred = new Prediction({
              ...pred,
              category,
              createdAt: pred.createdAt ? new Date(pred.createdAt) : new Date(),
              updatedAt: pred.updatedAt ? new Date(pred.updatedAt) : new Date()
            });
            await newPred.save();
            migratedCount++;
          }
        }
      }
    }

    res.json({ success: true, message: `Migration completed. ${migratedCount} predictions migrated.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});