import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gradientBg from '../assets/img/gradient-blue-bg.jpg';
import { useEffect } from 'react';

const Home = () => {
  const { currentUser } = useAuth();

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

  return (
    <div className="home-container">
      <img src={gradientBg} alt="background" className="home-bg" />

      <div className="home-content">
        <h1>Welcome to User Management App</h1>
        <p>This application allows you to manage user accounts.</p>

        <div className="features">
          <div className="feature">
            <h2><i className="fas fa-user"></i> User Registration</h2>
            <p>Create a new account to access all features.</p>
            {!currentUser && <Link to="/register" className="button">Sign Up</Link>}
          </div>

          <div className="feature">
            <h2><i className="fas fa-users"></i> User List</h2>
            <p>View all registered users in the system.</p>
            <Link to="/users" className="button">View Users</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
