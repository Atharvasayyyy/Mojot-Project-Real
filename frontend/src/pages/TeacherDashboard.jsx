import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUpTwoTone,
  WarningTwoTone,
  ChildFriendlyTwoTone
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const engagementByStudentData = [
  { name: 'Student 1', engagement: 85, stress: 25 },
  { name: 'Student 2', engagement: 75, stress: 35 },
  { name: 'Student 3', engagement: 90, stress: 15 },
  { name: 'Student 4', engagement: 70, stress: 40 },
  { name: 'Student 5', engagement: 88, stress: 20 }
];

const classroomData = [
  { time: '09:00', avgEngagement: 80, avgStress: 30 },
  { time: '10:00', avgEngagement: 82, avgStress: 28 },
  { time: '11:00', avgEngagement: 85, avgStress: 25 },
  { time: '12:00', avgEngagement: 78, avgStress: 35 },
  { time: '13:00', avgEngagement: 88, avgStress: 20 }
];

const studentsData = [
  {
    id: 1,
    name: 'Alex Johnson',
    engagement: 'High',
    stress: 'Normal',
    predictedHobby: 'Coding',
    alert: false
  },
  {
    id: 2,
    name: 'Sarah Smith',
    engagement: 'Medium',
    stress: 'Stressed',
    predictedHobby: 'Reading',
    alert: true
  },
  {
    id: 3,
    name: 'Mike Davis',
    engagement: 'High',
    stress: 'Calm',
    predictedHobby: 'Sports',
    alert: false
  },
  {
    id: 4,
    name: 'Emma Wilson',
    engagement: 'Low',
    stress: 'Very Stressed',
    predictedHobby: 'Music',
    alert: true
  }
];

export default function TeacherDashboard() {
  return (
    <Box sx={{ background: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            👨‍🏫 Teacher Analytics Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Monitor classroom engagement and student well-being
          </Typography>
        </Box>

        {/* Top Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Class Average Engagement</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>82%</Typography>
                  </Box>
                  <TrendingUpTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg Stress Level</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>28%</Typography>
                  </Box>
                  <WarningTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Students Monitored</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>28</Typography>
                  </Box>
                  <ChildFriendlyTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Alerts</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>2</Typography>
                  </Box>
                  <WarningTwoTone sx={{ fontSize: 40, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 Classroom Engagement Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={classroomData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgEngagement" stroke="#667eea" strokeWidth={2} name="Avg Engagement" />
                  <Line type="monotone" dataKey="avgStress" stroke="#f5576c" strokeWidth={2} name="Avg Stress" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                👥 Engagement by Student
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementByStudentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#667eea" name="Engagement %" />
                  <Bar dataKey="stress" fill="#f5576c" name="Stress %" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Students Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              📋 Real-time Student Status
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#f5f7fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Engagement</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Stress Level</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Predicted Interest</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Alert</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsData.map((student) => (
                  <TableRow key={student.id} sx={{ '&:hover': { background: '#f9f9f9' } }}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.engagement}
                        color={student.engagement === 'High' ? 'success' : student.engagement === 'Medium' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.stress}
                        variant="outlined"
                        size="small"
                        color={student.stress === 'Calm' ? 'success' : student.stress === 'Normal' ? 'primary' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.predictedHobby}
                        size="small"
                        sx={{ background: '#e0e7ff', color: '#667eea' }}
                      />
                    </TableCell>
                    <TableCell>
                      {student.alert ? (
                        <Chip label="⚠️ Alert" size="small" color="error" />
                      ) : (
                        <Chip label="✓ OK" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" sx={{ color: '#667eea', borderColor: '#667eea' }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}
