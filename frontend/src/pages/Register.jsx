import React, { useState, useContext } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'student'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      
      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on user type
      if (response.data.user.userType === 'parent') {
        navigate('/parent-dashboard');
      } else if (response.data.user.userType === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            🧠 IoT Engagement System
          </Typography>
          
          <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
            Join the revolution in student engagement monitoring
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
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
            />
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              disabled={loading}
              type="submit"
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/login" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
