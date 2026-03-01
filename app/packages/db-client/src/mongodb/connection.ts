import mongoose from 'mongoose';

let connected = false;

export async function connectMongo(uri?: string) {
  if (connected) return mongoose.connection;

  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://ananta:ananta_dev_password@localhost:27017/ananta?authSource=admin';

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  connected = true;
  return mongoose.connection;
}

export async function closeMongo() {
  if (connected) {
    await mongoose.disconnect();
    connected = false;
  }
}
