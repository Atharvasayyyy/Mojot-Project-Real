import React from 'react';
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
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  NotificationsActiveTwoTone,
  TrendingUpTwoTone,
  SchoolTwoTone,
  AssignmentTwoTone,
  WarningTwoTone,
  CheckCircleTwoTone
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const childEngagementData = [
  { day: 'Mon', engagement: 80, stress: 25 },
  { day: 'Tue', engagement: 82, stress: 23 },
  { day: 'Wed', engagement: 78, stress: 28 },
  { day: 'Thu', engagement: 85, stress: 20 },
  { day: 'Fri', engagement: 88, stress: 18 }
];

const alerts = [
  {
    id: 1,
    type: 'high-stress',
    title: 'High Stress Detected',
    message: 'Emma showed elevated stress levels during math class today',
    severity: 'critical',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Great Performance!',
    message: 'Sarah maintained high engagement during coding practice',
    severity: 'success',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'low-engagement',
    title: 'Low Engagement',
    message: 'Alex appeared disengaged during yesterday\'s English class',
    severity: 'warning',
    time: '1 day ago'
  }
];

const recommendations = [
  {
    id: 1,
    title: 'Consider coding activities',
    description: 'Emma shows high interest in coding-related tasks',
    icon: '👨‍💻'
  },
  {
    id: 2,
    title: 'Try interactive reading',
    description: 'Sarah engages well with interactive learning materials',
    icon: '📚'
  },
  {
    id: 3,
    title: 'Increase movement breaks',
    description: 'Alex performs better with frequent physical activity breaks',
    icon: '🏃'
  }
];

export default function ParentDashboard() {
  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            👨‍👩‍👧 Parent Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Monitor your child's engagement and wellness
          </Typography>
        </Box>

        {/* Top Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>This Week's Engagement</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>83%</Typography>
                  </Box>
                  <TrendingUpTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Stress</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>22%</Typography>
                  </Box>
                  <WarningTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Study Hours</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>12.5</Typography>
                  </Box>
                  <SchoolTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Sessions Completed</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>15</Typography>
                  </Box>
                  <AssignmentTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Weekly Trend */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📈 Weekly Engagement Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={childEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#667eea" strokeWidth={2} name="Engagement" />
                  <Line type="monotone" dataKey="stress" stroke="#f5576c" strokeWidth={2} name="Stress Level" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Active Alerts */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsActiveTwoTone sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Alerts
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {alerts.map((alert) => (
                  <Box key={alert.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {alert.severity === 'critical' && <WarningTwoTone sx={{ color: '#f5576c' }} />}
                        {alert.severity === 'warning' && <WarningTwoTone sx={{ color: '#ffa726' }} />}
                        {alert.severity === 'success' && <CheckCircleTwoTone sx={{ color: '#66bb6a' }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.title}
                        secondary={`${alert.message} - ${alert.time}`}
                        primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Recommendations */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            💡 Recommendations for Your Child
          </Typography>

          <Grid container spacing={3}>
            {recommendations.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.id}>
                <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent>
                    <Box sx={{ fontSize: '2rem', mb: 1 }}>{rec.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {rec.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {rec.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" sx={{ color: '#667eea' }}>Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            View Detailed Report
          </Button>
          <Button variant="outlined" sx={{ borderColor: '#667eea', color: '#667eea' }}>
            Schedule Meeting with Teacher
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
