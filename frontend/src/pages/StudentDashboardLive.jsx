import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StudentDashboardLive() {
  const [session, setSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem('token');

  // Get or start session
  useEffect(() => {
    const getOrStartSession = async () => {
      try {
        // Check if session exists
        const res = await axios.get(`${API_URL}/sessions/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.session) {
          setSession(res.data.session);
          setSessionActive(true);
        }
      } catch (err) {
        console.log('No active session');
      }
    };

    if (token) {
      getOrStartSession();
    }
  }, [token]);

  // Fetch analytics every 10 seconds
  useEffect(() => {
    if (!session || !sessionActive) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/analytics/session/${session.sessionId || session._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setAnalytics(res.data.data);
          setError('');

          // Add to chart data
          setChartData(prev => [...prev, {
            time: new Date().toLocaleTimeString(),
            engagement: res.data.data.engagementScore || 0,
            stress: res.data.data.stressScore || 0
          }].slice(-20)); // Keep last 20 data points
        }
      } catch (err) {
        setError('Failed to fetch analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchAnalytics();

    // Setup interval
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [session, token, sessionActive]);

  // Start new session
  const handleStartSession = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/sessions/start`,
        {
          activity: 'Maths Class',
          deviceId: 'ESP32-001',
          sessionType: 'classroom'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSession(res.data.session);
        setSessionActive(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to start session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // End session
  const handleEndSession = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/sessions/${session._id}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionActive(false);
      setSession(null);
      setAnalytics(null);
      setChartData([]);
      setError('');
    } catch (err) {
      setError('Failed to end session');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container>
        <Alert severity="error">Please login first</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📊 Live Engagement Monitoring
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Session Control */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              Session Status: {sessionActive ? '🟢 ACTIVE' : '⚪ INACTIVE'}
            </Typography>
            {session && (
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                Activity: {session.activity} | Started: {new Date(session.startTime).toLocaleTimeString()}
              </Typography>
            )}
          </Box>
          {sessionActive ? (
            <Button
              variant="contained"
              color="error"
              onClick={handleEndSession}
              disabled={loading}
            >
              End Session
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleStartSession}
              disabled={loading}
            >
              Start Session
            </Button>
          )}
        </Box>
      </Paper>

      {sessionActive && analytics && (
        <>
          {/* Metrics Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Engagement */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Engagement Score</Typography>
                  <Typography variant="h4" sx={{ my: 2, color: '#667eea' }}>
                    {analytics.engagementScore || 0}%
                  </Typography>
                  <LinearProgress variant="determinate" value={analytics.engagementScore || 0} />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {analytics.engagementScore > 70 ? '✅ Engaged' :
                     analytics.engagementScore > 40 ? '🟡 Neutral' : '⚠️ Disengaged'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Stress */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Stress Level</Typography>
                  <Typography variant="h4" sx={{ my: 2, color: '#f5576c' }}>
                    {analytics.stressScore || 0}%
                  </Typography>
                  <LinearProgress variant="determinate" value={analytics.stressScore || 0} />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {analytics.stressScore > 60 ? '⚠️ High Stress' :
                     analytics.stressScore > 30 ? '🟡 Moderate' : '✅ Calm'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Heart Rate */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Heart Rate</Typography>
                  <Typography variant="h4" sx={{ my: 2, color: '#764ba2' }}>
                    {Math.round(analytics.avgHeartRate || 0)} <span style={{ fontSize: '0.5em' }}>bpm</span>
                  </Typography>
                  <Typography variant="caption">
                    Min: {Math.round(analytics.minHeartRate || 0)} | Max: {Math.round(analytics.maxHeartRate || 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Duration */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Duration</Typography>
                  <Typography variant="h4" sx={{ my: 2, color: '#4facfe' }}>
                    {analytics.duration || 0} <span style={{ fontSize: '0.5em' }}>min</span>
                  </Typography>
                  <Typography variant="caption">
                    Data Points: {analytics.totalDataPoints || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Live Chart */}
          <Card sx={{ mb: 4, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>📈 Real-Time Engagement vs Stress</Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#667eea"
                    name="Engagement %"
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#f5576c"
                    name="Stress %"
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
          </Card>

          {/* Status Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>📊 Status Summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Activity:</strong> {analytics.activity}</Typography>
                  <Typography><strong>Current State:</strong> {analytics.state || 'Normal'}</Typography>
                  <Typography><strong>Session Active:</strong> {sessionActive ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Avg Motion Level:</strong> {Math.round(analytics.avgMotion || 0)}</Typography>
                  <Typography><strong>Total Data Points:</strong> {analytics.totalDataPoints || 0}</Typography>
                  <Typography><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {loading && !sessionActive && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
