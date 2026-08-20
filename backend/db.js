import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!MONGODB_URI || MONGODB_URI.trim() === '' || MONGODB_URI.includes('PASTE_MY_ATLAS_CONNECTION_STRING_HERE')) {
    const errorMsg = '⚠️ [DATABASE ERROR] MONGODB_URI is not configured! Please provide a valid MongoDB Atlas connection string in backend/.env';
    console.error(`\n❌ ${errorMsg}\n`);
    throw new Error(errorMsg);
  }

  try {
    console.log('[DB Connection] Initializing connection to MongoDB Atlas...');
    const db = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10, // Enable connection pooling
      serverSelectionTimeoutMS: 8000, // Fail fast if Atlas is unreachable
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(`\n✅ [DB Success] Connected to MongoDB Atlas cluster! Active database: ${db.connections[0].name}\n`);
    return mongoose.connection;
  } catch (err) {
    console.error(`\n❌ [DB Connection Failure] Could not establish connection to MongoDB Atlas.`);
    console.error(`Reason: ${err.message}\n`);
    isConnected = false;
    throw new Error(`Database connection failed: ${err.message}`);
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
