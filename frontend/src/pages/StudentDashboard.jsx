import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  Assignment,
  Warning
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const mockEngagementData = [
  { time: '09:00', engagement: 80, stress: 30 },
  { time: '09:30', engagement: 75, stress: 35 },
  { time: '10:00', engagement: 85, stress: 25 },
  { time: '10:30', engagement: 90, stress: 20 },
  { time: '11:00', engagement: 88, stress: 22 },
  { time: '11:30', engagement: 92, stress: 18 }
];

const mockActivityData = [
  { name: 'Reading', value: 30, color: '#667eea' },
  { name: 'Coding', value: 25, color: '#764ba2' },
  { name: 'Sports', value: 20, color: '#f093fb' },
  { name: 'Gaming', value: 15, color: '#4facfe' },
  { name: 'Social', value: 10, color: '#00f2fe' }
];

const mockHobbies = [
  { hobby: 'Coding', confidence: 0.92 },
  { hobby: 'Reading', confidence: 0.85 },
  { hobby: 'Gaming', confidence: 0.78 },
  { hobby: 'Sports', confidence: 0.65 },
  { hobby: 'Music', confidence: 0.58 }
];

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgEngagement: 0,
    avgStress: 0,
    todayDuration: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user profile
      const userRes = await axios.get(`${API_BASE_URL}/users/profile`, { headers });
      setUser(userRes.data.user);

      // Fetch sessions (mock for now)
      setSessions([
        {
          _id: '1',
          activity: 'Math Class',
          sessionType: 'classroom',
          startTime: new Date(Date.now() - 3600000),
          metrics: { avgEngagementScore: 85, avgStressLevel: 25 },
          predictions: { engagementLevel: 'high', stressLevel: 'normal', predictedHobby: 'Coding' }
        },
        {
          _id: '2',
          activity: 'Coding Practice',
          sessionType: 'homework',
          startTime: new Date(Date.now() - 7200000),
          metrics: { avgEngagementScore: 90, avgStressLevel: 15 },
          predictions: { engagementLevel: 'very-high', stressLevel: 'calm', predictedHobby: 'Coding' }
        }
      ]);

      setStats({
        totalSessions: 12,
        avgEngagement: 82,
        avgStress: 28,
        todayDuration: 240
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            👋 Welcome, {user?.firstName}!
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Your engagement and wellness dashboard
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="inherit" variant="body2" sx={{ opacity: 0.9 }}>
                      Engagement Score
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {stats.avgEngagement}%
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="inherit" variant="body2" sx={{ opacity: 0.9 }}>
                      Stress Level
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {stats.avgStress}%
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="inherit" variant="body2" sx={{ opacity: 0.9 }}>
                      Sessions
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {stats.totalSessions}
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="inherit" variant="body2" sx={{ opacity: 0.9 }}>
                      Today's Duration
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {Math.floor(stats.todayDuration / 60)}h
                    </Typography>
                  </Box>
                  <Favorite sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 Real-Time Engagement & Stress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#667eea" strokeWidth={2} name="Engagement" />
                  <Line type="monotone" dataKey="stress" stroke="#f5576c" strokeWidth={2} name="Stress Level" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🎯 Predicted Hobbies
              </Typography>
              <List>
                {mockHobbies.map((item, index) => (
                  <ListItem key={index} sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={item.hobby}
                      secondary={`Confidence: ${(item.confidence * 100).toFixed(0)}%`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={item.confidence * 100}
                      sx={{ width: 100, ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Activity Breakdown & Recent Sessions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🎪 Activity Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mockActivityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📅 Recent Sessions
              </Typography>
              {sessions.map((session) => (
                <Card key={session._id} sx={{ mb: 2, background: '#f9f9f9' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {session.activity}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                          {new Date(session.startTime).toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                          <Chip
                            label={`Engagement: ${session.metrics.avgEngagementScore}%`}
                            color="primary"
                            size="small"
                          />
                          <Chip
                            label={session.predictions.engagementLevel}
                            size="small"
                            sx={{ background: '#e0e7ff', color: '#667eea' }}
                          />
                        </Box>
                      </Box>
                      <Chip
                        label={session.predictions.predictedHobby}
                        sx={{ background: '#f0e7ff', color: '#764ba2' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
