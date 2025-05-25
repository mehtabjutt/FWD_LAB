import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb, ObjectId } from './db.js';

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Start server after database connection is established
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

// Routes
// Get all users
app.get('/users', async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const db = getDb();

    // Check if id is valid before creating ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
      return res.status(400).json({ error: 'Invalid user ID provided' });
    }

    let user;
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    } catch (idError) {
      console.error('Invalid ObjectId format:', idError);
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(`Error fetching user with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
app.post('/users', async (req, res) => {
  try {
    const db = getDb();
    const { name, email, password } = req.body;

    // Check if user with this email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const result = await db.collection('users').insertOne({ name, email, password });
    const newUser = await db.collection('users').findOne({ _id: result.insertedId });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const db = getDb();
    const { name, email, password } = req.body;

    // Check if id is valid before creating ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
      return res.status(400).json({ error: 'Invalid user ID provided' });
    }

    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Invalid ObjectId format:', idError);
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const result = await db.collection('users').updateOne(
      { _id: objectId },
      { $set: { name, email, password } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await db.collection('users').findOne({ _id: objectId });
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const db = getDb();

    // Check if id is valid before creating ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
      return res.status(400).json({ error: 'Invalid user ID provided' });
    }

    let objectId;
    try {
      objectId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error('Invalid ObjectId format:', idError);
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const result = await db.collection('users').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`Error deleting user with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
