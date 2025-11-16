const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Data directory
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

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

// Initialize category files if they don't exist
categories.forEach(category => {
  const filePath = path.join(dataDir, `${category}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, [], { spaces: 2 });
  }
});

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
    const { category } = req.query;
    
    if (category) {
      const filePath = path.join(dataDir, `${category}.json`);
      const predictions = await fs.readJson(filePath);
      res.json(predictions);
    } else {
      // Get all predictions from all categories
      const allPredictions = {};
      for (const cat of categories) {
        const filePath = path.join(dataDir, `${cat}.json`);
        allPredictions[cat] = await fs.readJson(filePath);
      }
      res.json(allPredictions);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/predictions', authenticate, async (req, res) => {
  try {
    const prediction = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { category } = req.body;
    if (!category || !categories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const filePath = path.join(dataDir, `${category}.json`);
    const predictions = await fs.readJson(filePath);
    predictions.push(prediction);
    await fs.writeJson(filePath, predictions, { spaces: 2 });

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

    const filePath = path.join(dataDir, `${category}.json`);
    const predictions = await fs.readJson(filePath);
    const predictionIndex = predictions.findIndex(p => p.id === id);
    
    if (predictionIndex === -1) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    predictions[predictionIndex] = {
      ...predictions[predictionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await fs.writeJson(filePath, predictions, { spaces: 2 });
    res.json(predictions[predictionIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/predictions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    
    if (!category || !categories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const filePath = path.join(dataDir, `${category}.json`);
    const predictions = await fs.readJson(filePath);
    const predictionIndex = predictions.findIndex(p => p.id === id);
    
    if (predictionIndex === -1) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    const deletedPrediction = predictions.splice(predictionIndex, 1)[0];
    await fs.writeJson(filePath, predictions, { spaces: 2 });
    res.json({ success: true, deleted: deletedPrediction });
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