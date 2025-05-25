import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/auth.css';
import gradientBg from '../assets/img/gradient-blue-bg.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      // Create user object without confirmPassword
      const userData = {
        name,
        email,
        password
      };

      await register(userData);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account. ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <img src={gradientBg} alt="register background" className="register__bg" />

      <form className="register__form" onSubmit={handleSubmit}>
        <h1 className="register__title">Create Your Account</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="register__inputs">
          <div className="register__box">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="register__input"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <i className="fa-regular fa-user"></i>
          </div>

          <div className="register__box">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="register__input"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <i className="fa-regular fa-envelope"></i>
          </div>

          <div className="register__box">
            <input
              type="password"
              placeholder="Create Password"
              required
              className="register__input"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <div className="register__box">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="register__input"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
        </div>

        <button type="submit" className="register__button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="register__login">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
