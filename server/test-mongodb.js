import axios from 'axios';

const API_URL = 'http://localhost:5001';

// Test all CRUD operations
async function testCrudOperations() {
  try {
    console.log('Starting MongoDB CRUD operations test...');
    
    // 1. CREATE - Register a new user
    console.log('\n1. Testing CREATE operation (Register user)');
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const createdUser = await axios.post(`${API_URL}/users`, newUser);
    console.log('User created successfully:', createdUser.data);
    const userId = createdUser.data._id;
    
    // 2. READ - Get all users
    console.log('\n2. Testing READ operation (Get all users)');
    const allUsers = await axios.get(`${API_URL}/users`);
    console.log(`Retrieved ${allUsers.data.length} users`);
    
    // 3. READ - Get user by ID
    console.log('\n3. Testing READ operation (Get user by ID)');
    const user = await axios.get(`${API_URL}/users/${userId}`);
    console.log('Retrieved user by ID:', user.data);
    
    // 4. UPDATE - Update user
    console.log('\n4. Testing UPDATE operation');
    const updatedData = {
      name: 'Updated Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const updatedUser = await axios.put(`${API_URL}/users/${userId}`, updatedData);
    console.log('User updated successfully:', updatedUser.data);
    
    // 5. DELETE - Delete user
    console.log('\n5. Testing DELETE operation');
    const deleteResponse = await axios.delete(`${API_URL}/users/${userId}`);
    console.log('User deleted successfully:', deleteResponse.data);
    
    // Verify deletion
    try {
      await axios.get(`${API_URL}/users/${userId}`);
    } catch (error) {
      console.log('Verified: User no longer exists');
    }
    
    console.log('\nAll MongoDB CRUD operations completed successfully!');
  } catch (error) {
    console.error('Error during CRUD operations test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testCrudOperations();
