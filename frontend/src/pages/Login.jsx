import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect based on user type
      if (response.data.user.userType === 'parent') {
        navigate('/parent-dashboard');
      } else if (response.data.user.userType === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 2
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
            🧠 Welcome Back
          </Typography>

          <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
            Your AI-Powered Engagement Monitoring System
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Remember me"
              sx={{ mt: 2, mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              disabled={loading}
              type="submit"
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <Link href="/register" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                Create one now
              </Link>
            </Typography>
          </form>
        </Paper>

        {/* Features */}
        <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h6">📊</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Real-time Monitoring</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h6">🤖</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>AI Predictions</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'white', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h6">📈</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Deep Analytics</Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
