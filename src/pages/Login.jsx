import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/auth.css';
import gradientBg from '../assets/img/gradient-blue-bg.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img src={gradientBg} alt="login background" className="login__bg" />

      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Welcome Back</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="login__inputs">
          <div className="login__box">
            <input
              type="email"
              placeholder="Email"
              required
              className="login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fa-regular fa-envelope"></i>
          </div>

          <div className="login__box">
            <input
              type="password"
              placeholder="Password"
              required
              className="login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
        </div>

        <div className="login__check">
          <div className="login__check-box">
            <input
              type="checkbox"
              className="login__check-input"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="" className="login__check-label">Remember me</label>
          </div>

          <a href="#" className="login__forgot">Forgot Password?</a>
        </div>

        <button type="submit" className="login__button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login to Your Account'}
        </button>

        <div className="login__register">
          Don't have an account? <Link to="/register">Register Now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
