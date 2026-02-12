import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TrendingUpTwoTone, SchoolTwoTone, DesktopMacTwoTone, SecurityTwoTone } from '@mui/icons-material';

const features = [
  {
    icon: <TrendingUpTwoTone sx={{ fontSize: 40, color: '#667eea' }} />,
    title: 'Real-Time Analytics',
    description: 'Monitor student engagement and stress levels in real-time with our advanced IoT sensors'
  },
  {
    icon: <SchoolTwoTone sx={{ fontSize: 40, color: '#764ba2' }} />,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on machine learning predictions of student interests'
  },
  {
    icon: <DesktopMacTwoTone sx={{ fontSize: 40, color: '#f5576c' }} />,
    title: 'Beautiful Dashboard',
    description: 'Visualize complex data with intuitive charts and visualizations for better decisions'
  },
  {
    icon: <SecurityTwoTone sx={{ fontSize: 40, color: '#4facfe' }} />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with industry-standard security measures'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 6, md: 12 },
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            🧠 AI-Powered Student Engagement & Stress Monitoring
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Advanced wearable technology meets machine learning to understand student well-being
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ background: 'white', color: '#667eea', fontWeight: 'bold' }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, background: '#f5f7fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center', color: '#333' }}>
            ✨ Powerful Features
          </Typography>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#333' }}>
            🛠️ Built with Modern Tech Stack
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>⚛️ React</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Modern, responsive UI with Material Design
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>🟢 Node.js</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Scalable, high-performance backend API
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>🐍 Python</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Advanced ML models for predictions
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>🗄️ MongoDB</Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Flexible, scalable data storage
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Transform Education?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of educators and parents using IoT engagement monitoring
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ background: 'white', color: '#667eea', fontWeight: 'bold' }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ background: '#222', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2024 IoT Engagement System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
