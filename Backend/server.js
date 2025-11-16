import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '172.16.1.6';

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://172.16.1.6:27017/daily';

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    await ensureDatabaseInitialized();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Warehouse backend is running',
    mongo: mongoose.connection.readyState,
  });
});

// Products routes
app.use('/api/products', productsRouter);

app.get('/', (_req, res) => {
  res.send('Backend API is running. Use /api routes.');
});

app.listen(PORT, HOST, () => {
  console.log(`Backend server listening on http://${HOST}:${PORT}`);
});

async function ensureDatabaseInitialized() {
  const db = mongoose.connection.db;
  if (!db) return;

  try {
    const collectionName = 'meta';
    const collections = await db.listCollections({ name: collectionName }).toArray();

    if (collections.length === 0) {
      await db.createCollection(collectionName);
      console.log(`Created collection '${collectionName}' to initialize database.`);
    }

    const metaCollection = db.collection(collectionName);
    await metaCollection.updateOne(
      { _id: 'init' },
      {
        $setOnInsert: {
          createdAt: new Date(),
          note: 'Initial placeholder to ensure database exists',
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Failed to initialize MongoDB database:', error.message);
  }
}

