import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      
      setMessage('Registration successful! Redirecting...');
      
      // Auto-login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (form.password.length === 0) return { strength: 0, color: '#e2e8f0', text: '' };
    if (form.password.length < 6) return { strength: 33, color: '#fc8181', text: 'Weak' };
    if (form.password.length < 8) return { strength: 66, color: '#f6ad55', text: 'Medium' };
    return { strength: 100, color: '#68d391', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join us and start booking events</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div style={message.includes('successful') ? styles.successAlert : styles.errorAlert}>
            <span style={styles.messageIcon}>
              {message.includes('successful') ? '✅' : '⚠️'}
            </span>
            {message}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{
                ...styles.input,
                ...(errors.name && styles.inputError)
              }}
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                ...styles.input,
                ...(errors.email && styles.inputError)
              }}
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Phone Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your 10-digit phone number"
              style={{
                ...styles.input,
                ...(errors.phone && styles.inputError)
              }}
            />
            {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError)
              }}
            />
            {form.password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthBar}>
                  <div 
                    style={{
                      ...styles.strengthFill,
                      width: `${passwordStrength.strength}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span style={{...styles.strengthText, color: passwordStrength.color}}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={{
                ...styles.input,
                ...(errors.confirmPassword && styles.inputError)
              }}
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Terms and Conditions */}
        <div style={styles.terms}>
          <p style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" style={styles.termsLink}>Terms of Service</Link> and{' '}
            <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
          </p>
        </div>

        {/* Login Link */}
        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account? </span>
          <Link to="/login" style={styles.loginLink}>
            Sign in
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
    maxWidth: '450px',
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
  successAlert: {
    backgroundColor: '#c6f6d5',
    color: '#2d5016',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
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
  messageIcon: {
    marginRight: '8px'
  },
  form: {
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '20px'
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
  inputError: {
    borderColor: '#fc8181',
    boxShadow: '0 0 0 3px rgba(252, 129, 129, 0.1)'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  passwordStrength: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px'
  },
  strengthBar: {
    flex: 1,
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  strengthFill: {
    height: '100%',
    transition: 'all 0.3s ease'
  },
  strengthText: {
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '40px'
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
  terms: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '0 10px'
  },
  termsText: {
    fontSize: '12px',
    color: '#718096',
    lineHeight: '1.4',
    margin: 0
  },
  termsLink: {
    color: '#4299e1',
    textDecoration: 'none',
    fontWeight: '500'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    color: '#718096',
    fontSize: '14px'
  },
  loginLink: {
    color: '#4299e1',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

export default Register;