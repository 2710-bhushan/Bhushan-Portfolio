import { MongoClient } from "mongodb";

const globalForMongo = global as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set. Please add it to your environment variables.");
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri);
    globalForMongo.mongoClientPromise = client.connect();
  }

  return globalForMongo.mongoClientPromise;
}

