import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UsersList from './pages/UsersList';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<UsersList />} />
                <Route
                  path="/profile/:id"
                  element={
                    <ErrorBoundary>
                      <UserProfile />
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
