import React, { useState } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Avatar, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, CircularProgress
} from '@mui/material';
import { TrendingUp, Group, Build, MoreVert, ArrowUpward, ArrowDownward, Star, Download } from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { generateExecutiveReport } from '../../utils/generateReport';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, PieChart, Pie, Cell, ComposedChart
} from 'recharts';

const salesData = [
  { name: 'Mon', sales: 45200, target: 40000 },
  { name: 'Tue', sales: 38900, target: 40000 },
  { name: 'Wed', sales: 52100, target: 45000 },
  { name: 'Thu', sales: 41800, target: 45000 },
  { name: 'Fri', sales: 67300, target: 50000 },
  { name: 'Sat', sales: 89200, target: 60000 },
  { name: 'Sun', sales: 23400, target: 20000 },
];

const serviceData = [
  { name: 'Mon', efficiency: 85, capacity: 100 },
  { name: 'Tue', efficiency: 92, capacity: 100 },
  { name: 'Wed', efficiency: 88, capacity: 100 },
  { name: 'Thu', efficiency: 95, capacity: 100 },
  { name: 'Fri', efficiency: 105, capacity: 100 },
  { name: 'Sat', efficiency: 110, capacity: 100 },
  { name: 'Sun', efficiency: 40, capacity: 50 },
];

const revenueDonutData = [
  { name: 'New Sales', value: 45 },
  { name: 'Used Sales', value: 25 },
  { name: 'Service', value: 15 },
  { name: 'Parts', value: 10 },
  { name: 'F&I', value: 5 },
];
const COLORS = ['#1a365d', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'];

const csiData = [
  { name: 'Sales', score: 96 },
  { name: 'Service', score: 92 },
  { name: 'F&I', score: 98 },
  { name: 'Overall', score: 95 },
];

const topPerformers = [
  { name: 'Sarah Jenkins', dept: 'Sales', score: 98, units: 24 },
  { name: 'Mike Ross', dept: 'F&I', score: 96, units: 18 },
  { name: 'David Chen', dept: 'Service', score: 99, units: 42 },
  { name: 'Elena Rodriguez', dept: 'Sales', score: 94, units: 19 },
];

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom fontWeight="600" textTransform="uppercase" letterSpacing={0.5}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 1 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend > 0 ? <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} /> : <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />}
            <Typography variant="body2" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
              {Math.abs(trend)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">vs last month</Typography>
          </Box>
          {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { showNotification, formatPrice } = useData();
  const [reportLoading, setReportLoading] = useState(false);

  const handleGenerateReport = () => {
    setReportLoading(true);
    showNotification('Compiling executive report— downloading shortly…');
    setTimeout(() => {
      try {
        generateExecutiveReport();
        showNotification('Report downloaded successfully!');
      } catch (err) {
        console.error(err);
        showNotification('Failed to generate report.', 'error');
      }
      setReportLoading(false);
    }, 600);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">Executive Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">Enterprise Performance Overview</Typography>
          </Box>
          <Paper 
            sx={{ 
              px: 2, 
              py: 1, 
              bgcolor: 'rgba(56, 189, 248, 0.1)', 
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', animation: 'pulse 2s infinite' }} />
            <Typography variant="body2" fontWeight="600" color="secondary.main">
              AI Insight: Sales forecasting up 12% for next week
            </Typography>
          </Paper>
        </Box>
        <Button
          variant="contained" color="primary" size="large"
          disabled={reportLoading}
          startIcon={reportLoading ? <CircularProgress size={16} color="inherit" /> : <Download />}
          onClick={handleGenerateReport}
        >
          {reportLoading ? 'Generating…' : 'Generate Report'}
        </Button>
      </Box>

      {/* KPI SUMMARY CARDS ROW */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Operational Efficiency" value="94.2%" icon={<TrendingUp />} color="success" trend={2.5} subtitle="Benchmarked across all depts" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="F&I Penetration" value="78.5%" icon={<Group />} color="primary" trend={5.2} subtitle={`PVR avg ${formatPrice(1850)}`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Average Wait Time" value="14m" icon={<Build />} color="warning" trend={-12.4} subtitle="Service lane check-in" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="CSI Score" value="96.8" icon={<Star />} color="success" trend={1.1} subtitle="Top 5% regional" />
        </Grid>
      </Grid>

      {/* DASHBOARD ANALYTICS ROW 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Weekly Sales Performance</Typography>
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>
            <Box sx={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={salesData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `${formatPrice(v/1000)}k`.replace('.00', '')} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: 8}} formatter={(value) => formatPrice(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="sales" name="Actual Sales" fill="#1a365d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#38bdf8" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Service Efficiency (%)</Typography>
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>
            <Box sx={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={serviceData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: 8}} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Line type="monotone" dataKey="efficiency" name="Labor Efficiency" stroke="#10b981" strokeWidth={3} dot={{r:4}} />
                  <Line type="monotone" dataKey="capacity" name="Capacity Baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* DASHBOARD ANALYTICS ROW 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Automation by Department</Typography>
              <Chip label="Real-time" size="small" color="primary" variant="outlined" />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, minHeight: 300 }}>
              {[
                { label: 'Sales (CRM & Desking)', val: 85, color: 'primary' },
                { label: 'Service (Scheduling & RO)', val: 62, color: 'warning' },
                { label: 'Parts Inventory', val: 94, color: 'success' },
                { label: 'F&I Contracting', val: 78, color: 'info' }
              ].map((item, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">{item.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.val}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={item.val} color={item.color} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Top Performers This Month</Typography>
              <Button size="small">View Leaderboard</Button>
            </Box>
            <Box sx={{ flexGrow: 1, mt: 1 }}>
              <TableContainer sx={{ minHeight: 300, display: 'flex', alignItems: 'center' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Units/ROs</TableCell>
                      <TableCell align="right">CSI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topPerformers.map((row, i) => (
                      <TableRow key={i} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.light', fontSize: '0.8rem' }}>{row.name.charAt(0)}</Avatar>
                            <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Chip size="small" label={row.dept} variant="outlined" /></TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{row.units}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight="bold">{row.score}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* DASHBOARD ANALYTICS ROW 3 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Revenue Breakdown by Department</Typography>
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: 8}} formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Customer Satisfaction (CSI)</Typography>
              <IconButton size="small"><MoreVert /></IconButton>
            </Box>
            <Box sx={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={csiData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#0f172a', fontWeight: 600}} width={60} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: 8}} />
                  <Bar dataKey="score" name="CSI Score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                    {csiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 95 ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
