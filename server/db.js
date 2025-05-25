import { MongoClient, ObjectId } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'userManagementApp';

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    db = client.db(dbName);

    // Check if users collection exists, if not create it with sample data
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('users')) {
      await initializeUsersCollection();
    }

    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function initializeUsersCollection() {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'password123'
    }
  ];

  await db.collection('users').insertMany(users);
  console.log('Sample users added to database');
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

export {
  connectToDatabase,
  getDb,
  ObjectId
};
