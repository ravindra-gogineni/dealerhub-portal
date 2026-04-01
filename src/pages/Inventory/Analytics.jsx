import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { Refresh, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../context/DataContext';

const turnRateData = [
  { name: 'Jan', newCar: 42, usedCar: 55 },
  { name: 'Feb', newCar: 48, usedCar: 58 },
  { name: 'Mar', newCar: 45, usedCar: 52 },
  { name: 'Apr', newCar: 56, usedCar: 63 },
  { name: 'May', newCar: 52, usedCar: 59 },
  { name: 'Jun', newCar: 61, usedCar: 67 },
  { name: 'Jul', newCar: 58, usedCar: 65 },
  { name: 'Aug', newCar: 65, usedCar: 71 },
];

const profitMarginData = [
  { category: 'Used SUVs', margin: 18.5 },
  { category: 'New SUVs', margin: 12.2 },
  { category: 'Used Sedans', margin: 15.4 },
  { category: 'New Sedans', margin: 10.1 },
  { category: 'Used Trucks', margin: 22.3 },
  { category: 'New Trucks', margin: 14.8 },
  { category: 'Used Luxury', margin: 19.7 },
  { category: 'CPO Vehicles', margin: 16.2 },
];

const stockMixData = [
  { name: 'New Cars', value: 812 },
  { name: 'Used Cars', value: 433 },
  { name: 'CPO', value: 155 },
  { name: 'On Order', value: 89 },
];
const COLORS = ['#1a365d', '#0ea5e9', '#10b981', '#f59e0b'];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#334155" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={500}>
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const Analytics = () => {
  const { showNotification, formatPrice } = useData();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Inventory Analytics</Typography>
          <Typography variant="body1" color="text.secondary">Monitor turn rates, profit margins, and market days supply.</Typography>
        </Box>
        <Button variant="outlined" size="large" startIcon={<Refresh />} onClick={() => showNotification("Inventory analytics refreshed.")}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography color="text.secondary" variant="body2" textTransform="uppercase" letterSpacing={0.5} fontWeight={600}>Avg Days in Supply</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 1, color: '#0ea5e9' }}>42</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDownward sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>5 days</Typography>
                <Typography variant="body2" color="text.secondary">less vs last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography color="text.secondary" variant="body2" textTransform="uppercase" letterSpacing={0.5} fontWeight={600}>Overall Turn Rate</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 1, color: '#10b981' }}>65.2%</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>+4.1%</Typography>
                <Typography variant="body2" color="text.secondary">vs last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography color="text.secondary" variant="body2" textTransform="uppercase" letterSpacing={0.5} fontWeight={600}>Avg Gross / Unit</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 1, color: '#f59e0b' }}>{formatPrice(3450)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                <Typography variant="body2" color="error.main" fontWeight={600}>-{formatPrice(120)}</Typography>
                <Typography variant="body2" color="text.secondary">vs last month</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography color="text.secondary" variant="body2" textTransform="uppercase" letterSpacing={0.5} fontWeight={600}>Total Units</Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 1, color: '#8b5cf6' }}>1,489</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>+32 units</Typography>
                <Typography variant="body2" color="text.secondary">this week</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Inventory Turn Rate Trend</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={turnRateData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1a365d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={40} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13 }} />
                  <Legend wrapperStyle={{fontSize: 13}} />
                  <Area type="monotone" dataKey="newCar" stroke="#1a365d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNew)" name="New Vehicles" dot={{r:4}} />
                  <Area type="monotone" dataKey="usedCar" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsed)" name="Used Vehicles" dot={{r:4}} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Stock Mix Breakdown</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={stockMixData} 
                    innerRadius={70} 
                    outerRadius={120} 
                    paddingAngle={4} 
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={true}
                  >
                    {stockMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 4, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Profit Margin by Category</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitMarginData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} angle={-15} textAnchor="end" height={50} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `${v}%`} width={45} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Margin']} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 13 }} />
                  <Bar dataKey="margin" fill="#1a365d" radius={[6, 6, 0, 0]} name="Margin %" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
