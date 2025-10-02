import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              style={styles.input}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              style={styles.input}
              required 
            />
          </div>

          <button 
            type="submit" 
            style={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        {/* Social Login (Optional) */}
        <div style={styles.socialContainer}>
          <button type="button" style={styles.socialButton}>
            <span style={styles.socialIcon}>🔵</span>
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Don't have an account? </span>
          <Link to="/register" style={styles.signupLink}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #e2e8f0'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0
  },
  errorAlert: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
  },
  errorIcon: {
    marginRight: '8px'
  },
  form: {
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    outline: 'none'
  },
  inputFocus: {
    borderColor: '#4299e1',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
  },
  button: {
    width: '100%',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLoading: {
    width: '100%',
    backgroundColor: '#a0aec0',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  },
  forgotLink: {
    fontSize: '14px',
    color: '#4299e1',
    textDecoration: 'none',
    fontWeight: '500'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '25px 0'
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 15px',
    color: '#718096',
    fontSize: '14px'
  },
  socialContainer: {
    marginBottom: '25px'
  },
  socialButton: {
    width: '100%',
    backgroundColor: 'white',
    color: '#4a5568',
    border: '2px solid #e2e8f0',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  socialIcon: {
    marginRight: '10px'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    color: '#718096',
    fontSize: '14px'
  },
  signupLink: {
    color: '#4299e1',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

// Add CSS animation for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Login;