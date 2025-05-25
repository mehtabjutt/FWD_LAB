import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import gradientBg from '../assets/img/gradient-blue-bg.jpg';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Font Awesome icons
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // Remove password from user data for security
        const usersWithoutPasswords = data.map(({ password, ...user }) => user);
        setUsers(usersWithoutPasswords);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  // Error is now handled with the ErrorMessage component

  return (
    <div className="users-page">
      <img src={gradientBg} alt="users background" className="users-bg" />

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="users-container">
        <h2><i className="fas fa-users"></i> Registered Users</h2>

        {users.length === 0 ? (
          <p>No users registered yet.</p>
        ) : (
          <div className="users-list">
            {users.map((user, index) => {
              const colors = ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c'];
              const color = colors[index % colors.length];
              return (
                <div
                  key={user._id}
                  className="user-card"
                  style={{
                    borderLeft: `4px solid ${color}`,
                    borderTop: `1px solid ${color}`,
                    borderRight: `1px solid ${color}`,
                    borderBottom: `1px solid ${color}`
                  }}
                >
                  <h3><i className="fas fa-user"></i> {user.name}</h3>
                  <p><i className="fas fa-envelope"></i> {user.email}</p>
                  <Link to={`/profile/${user._id}`} className="button">
                    <i className="fas fa-id-card"></i> View Profile
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
