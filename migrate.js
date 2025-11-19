require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for migration'))
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

async function migrateData() {
  try {
    const dataDir = path.join(__dirname, 'data');

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
            console.log(`Migrated prediction: ${pred.match}`);
          } else {
            console.log(`Prediction already exists: ${pred.match}`);
          }
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateData();