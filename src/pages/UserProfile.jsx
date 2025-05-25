import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import gradientBg from '../assets/img/gradient-blue-bg.jpg';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const isOwner = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if id is valid
        if (!id || id === 'undefined' || id === 'null') {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        const userData = await getUserById(id);
        // Remove password from user data for security
        const { password, ...userWithoutPassword } = userData;
        setUser(userWithoutPassword);
        setFormData({
          name: userWithoutPassword.name,
          email: userWithoutPassword.email
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user profile');
        setLoading(false);
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      return setError('You are not authorized to edit this profile');
    }

    try {
      // Preserve the password from the original user object
      const updatedUser = await updateUser(id, {
        ...formData,
        password: user.password // This is just for our mock API, in a real app you wouldn't do this
      });

      // Remove password from updated user data
      const { password, ...updatedUserWithoutPassword } = updatedUser;
      setUser(updatedUserWithoutPassword);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      return setError('You are not authorized to delete this profile');
    }

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUser(id);
        // If user deletes their own account, log them out
        logout();
        navigate('/');
      } catch (error) {
        setError('Failed to delete account');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  // Error is now handled with the ErrorMessage component

  if (!user) {
    return <div className="error-message">User not found</div>;
  }

  return (
    <div className="profile-page">
      <img src={gradientBg} alt="profile background" className="profile-bg" />

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="profile-container">
        <h1>User Profile</h1>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <h2><i className="fas fa-user-edit"></i> Edit Profile</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="button edit-button">
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="button cancel-button"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <h2><i className="fas fa-user-circle"></i> User Details</h2>
            <div className="profile-field">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="profile-field">
              <strong>Email:</strong> {user.email}
            </div>

            {isOwner && (
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="button edit-button"
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="button delete-button"
                >
                  <i className="fas fa-trash-alt"></i> Delete Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
