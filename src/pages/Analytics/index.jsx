import React, { useState } from 'react';
import {
  Grid, Paper, Typography, Box, Avatar, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Menu, MenuItem, Divider, Select, FormControl, InputLabel,
  ToggleButton, ToggleButtonGroup, Tooltip, Badge, Alert, Snackbar
} from '@mui/material';
import {
  MoreVert, EmojiEvents, TrendingUp, TrendingDown, Download, Refresh,
  FilterList, Close, Person, Star, StarBorder, WorkspacePremium,
  BarChart as BarChartIcon, PieChart as PieChartIcon, TableChart,
  ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// ─── Data ────────────────────────────────────────────────────────────────
const allPerformers = [
  { rank: 1, name: 'David Chen',     dept: 'Service', score: 99, units: 42, revenue: 189000, growth: '+18%', trend: 'up',   avatar: 'D', color: '#1a365d' },
  { rank: 2, name: 'Sarah Jenkins',  dept: 'Sales',   score: 98, units: 24, revenue: 215000, growth: '+12%', trend: 'up',   avatar: 'S', color: '#0ea5e9' },
  { rank: 3, name: 'Mike Ross',      dept: 'F&I',     score: 96, units: 18, revenue: 142000, growth: '+9%',  trend: 'up',   avatar: 'M', color: '#10b981' },
  { rank: 4, name: 'Elena Rodriguez',dept: 'Sales',   score: 94, units: 19, revenue: 178000, growth: '+7%',  trend: 'up',   avatar: 'E', color: '#f59e0b' },
  { rank: 5, name: 'James Park',     dept: 'Service', score: 91, units: 35, revenue: 158000, growth: '+4%',  trend: 'up',   avatar: 'J', color: '#8b5cf6' },
  { rank: 6, name: 'Priya Sharma',   dept: 'F&I',     score: 89, units: 14, revenue: 121000, growth: '-2%',  trend: 'down', avatar: 'P', color: '#ef4444' },
  { rank: 7, name: 'Carlos Vega',    dept: 'Sales',   score: 87, units: 16, revenue: 145000, growth: '+3%',  trend: 'up',   avatar: 'C', color: '#0ea5e9' },
  { rank: 8, name: 'Amy Liu',        dept: 'Service', score: 85, units: 28, revenue: 132000, growth: '+1%',  trend: 'up',   avatar: 'A', color: '#10b981' },
];

const revenueDonutData = [
  { name: 'New Sales', value: 45, amount: 1620000 },
  { name: 'Used Sales', value: 25, amount: 900000 },
  { name: 'Service', value: 15, amount: 540000 },
  { name: 'Parts', value: 10, amount: 360000 },
  { name: 'F&I', value: 5, amount: 180000 },
];
const PIE_COLORS = ['#1a365d', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'];

const csiData = [
  { name: 'Sales', score: 96, benchmark: 90 },
  { name: 'Service', score: 92, benchmark: 90 },
  { name: 'F&I', score: 98, benchmark: 90 },
  { name: 'Overall', score: 95, benchmark: 90 },
];

const automationData = [
  { label: 'Sales (CRM & Desking)', val: 85, color: 'primary',  hex: '#1a365d' },
  { label: 'Service (Scheduling & RO)', val: 62, color: 'warning', hex: '#f59e0b' },
  { label: 'Parts Inventory', val: 94, color: 'success', hex: '#10b981' },
  { label: 'F&I Contracting', val: 78, color: 'info',    hex: '#0ea5e9' },
];

const radarData = [
  { subject: 'Revenue', A: 94, fullMark: 100 },
  { subject: 'CSI', A: 95, fullMark: 100 },
  { subject: 'Efficiency', A: 88, fullMark: 100 },
  { subject: 'Automation', A: 80, fullMark: 100 },
  { subject: 'Retention', A: 91, fullMark: 100 },
  { subject: 'Growth', A: 85, fullMark: 100 },
];

const periods = ['This Week', 'This Month', 'Q1 2026', 'FY 2026'];

const formatCurrency = (n) => `$${(n / 1000).toFixed(0)}K`;

// ─── Custom Tooltip Styles ────────────────────────────────────────────────
const TooltipStyle = { borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 };

// ─── Component ────────────────────────────────────────────────────────────
const KPIAnalytics = () => {
  const [period, setPeriod] = useState('This Month');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [revenueMenuAnchor, setRevenueMenuAnchor] = useState(null);
  const [csiMenuAnchor, setCsiMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '' });
  const [deptFilter, setDeptFilter] = useState('All');
  const [chartView, setChartView] = useState('chart'); // 'chart' | 'table'

  const showSnack = (msg) => setSnackbar({ open: true, msg });

  const filteredPerformers = deptFilter === 'All'
    ? allPerformers
    : allPerformers.filter(p => p.dept === deptFilter);

  const handleExportCSV = (label) => {
    const rows = [['Rank', 'Name', 'Department', 'CSI Score', 'Units', 'Revenue', 'Growth']];
    allPerformers.forEach(p => rows.push([p.rank, p.name, p.dept, p.score, p.units, `$${p.revenue.toLocaleString()}`, p.growth]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${label.replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(a.href);
    showSnack(`${label} data exported as CSV.`);
  };

  const handleEmployeeClick = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeDialogOpen(true);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <Box>
      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">KPI Analytics</Typography>
          <Typography variant="body1" color="text.secondary">Detailed enterprise performance metrics</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={period} exclusive size="small"
            onChange={(_, v) => { if (v) { setPeriod(v); showSnack(`Period changed to: ${v}`); } }}
          >
            {periods.map(p => (
              <ToggleButton key={p} value={p} sx={{ fontSize: '0.75rem', px: 1.5 }}>{p}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Button
            variant="outlined" size="small" startIcon={<Download />}
            onClick={() => handleExportCSV('KPI_Analytics')}
          >
            Export
          </Button>
          <Button
            variant="outlined" size="small" startIcon={<Refresh />}
            onClick={() => showSnack('KPI data refreshed from live sources.')}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* ── SUMMARY KPI CARDS ───────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: 'Avg. CSI Score',    value: '95.3', sub: '+1.2 pts vs last month', up: true,  color: '#10b981' },
          { label: 'Top Performer',     value: 'D. Chen', sub: '99 CSI · 42 ROs',     up: true,  color: '#1a365d' },
          { label: 'F&I Penetration',   value: '78.5%',  sub: '+5.2% vs last month',  up: true,  color: '#8b5cf6' },
          { label: 'Avg Automation',    value: '79.8%',  sub: 'Across all depts.',     up: true,  color: '#0ea5e9' },
        ].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ height: '100%', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 } }}
              onClick={() => showSnack(`Viewing detail for: ${kpi.label}`)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>
                  {kpi.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, mb: 0.5, color: kpi.color }}>
                  {kpi.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {kpi.up
                    ? <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} />
                    : <ArrowDownward sx={{ fontSize: 14, color: 'error.main' }} />
                  }
                  <Typography variant="caption" color={kpi.up ? 'success.main' : 'error.main'} fontWeight={600}>
                    {kpi.sub}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── ROW 1: Automation + Performers ─────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Automation */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Automation by Department</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label="Real-time" size="small" color="primary" variant="outlined" />
                <Tooltip title="Export Automation Data">
                  <IconButton size="small" onClick={() => handleExportCSV('Automation_Levels')}>
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
              {automationData.map((item, idx) => (
                <Box key={idx}
                  sx={{ cursor: 'pointer', p: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' }, transition: 'background 0.15s' }}
                  onClick={() => showSnack(`${item.label}: ${item.val}% automation achieved`)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">{item.label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">{item.val}%</Typography>
                      <Chip
                        size="small" label={item.val >= 80 ? 'On Track' : 'Needs Attn'}
                        color={item.val >= 80 ? 'success' : 'warning'} variant="outlined"
                        sx={{ height: 18, fontSize: '0.6rem' }}
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate" value={item.val}
                    color={item.color}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Top Performers This Month</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="small" variant="outlined" sx={{ minWidth: 90 }}>
                  <InputLabel sx={{ fontSize: '0.75rem' }}>Dept</InputLabel>
                  <Select
                    label="Dept" value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {['All','Sales','Service','F&I'].map(d => (
                      <MenuItem key={d} value={d} sx={{ fontSize: '0.8rem' }}>{d}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button size="small" variant="outlined" startIcon={<EmojiEvents />}
                  onClick={() => setLeaderboardOpen(true)}
                >
                  View Leaderboard
                </Button>
              </Box>
            </Box>
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', bgcolor: 'background.default' } }}>
                    <TableCell>#</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Dept</TableCell>
                    <TableCell align="right">Units</TableCell>
                    <TableCell align="right">CSI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPerformers.slice(0, 5).map((row) => (
                    <TableRow key={row.rank} hover sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                      onClick={() => handleEmployeeClick(row)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{getRankIcon(row.rank)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: row.color, fontSize: '0.75rem' }}>
                            {row.avatar}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Chip size="small" label={row.dept} variant="outlined" sx={{ fontSize: '0.7rem' }} /></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">{row.units}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="success.main" fontWeight="bold">{row.score}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => handleExportCSV('Top_Performers')} startIcon={<Download />}>
                Export CSV
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── ROW 2: Revenue Donut + CSI Bar ─────────────────────── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Revenue Breakdown by Department</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <ToggleButtonGroup value={chartView} exclusive size="small"
                  onChange={(_, v) => v && setChartView(v)}
                >
                  <ToggleButton value="chart" sx={{ p: 0.5 }}>
                    <Tooltip title="Chart View"><PieChartIcon fontSize="small" /></Tooltip>
                  </ToggleButton>
                  <ToggleButton value="table" sx={{ p: 0.5 }}>
                    <Tooltip title="Table View"><TableChart fontSize="small" /></Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
                <IconButton size="small" onClick={(e) => setRevenueMenuAnchor(e.currentTarget)}>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>

            {chartView === 'chart' ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueDonutData} cx="50%" cy="50%"
                      innerRadius={65} outerRadius={105}
                      paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {revenueDonutData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} cursor="pointer" />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={TooltipStyle}
                      formatter={(value, name, props) => [
                        `${value}% (${formatCurrency(props.payload.amount)})`, name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <TableContainer sx={{ flexGrow: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Share %</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {revenueDonutData.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: PIE_COLORS[i] }} />
                            {row.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.value}%</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {formatCurrency(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Revenue context menu */}
          <Menu anchorEl={revenueMenuAnchor} open={Boolean(revenueMenuAnchor)} onClose={() => setRevenueMenuAnchor(null)}>
            <MenuItem onClick={() => { handleExportCSV('Revenue_Breakdown'); setRevenueMenuAnchor(null); }}>
              <Download sx={{ mr: 1, fontSize: 18 }} /> Export CSV
            </MenuItem>
            <MenuItem onClick={() => { showSnack('Revenue chart refreshed.'); setRevenueMenuAnchor(null); }}>
              <Refresh sx={{ mr: 1, fontSize: 18 }} /> Refresh Data
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { showSnack('Filtered to current quarter data.'); setRevenueMenuAnchor(null); }}>
              <FilterList sx={{ mr: 1, fontSize: 18 }} /> Filter by Quarter
            </MenuItem>
            <MenuItem onClick={() => { setChartView(v => v === 'chart' ? 'table' : 'chart'); setRevenueMenuAnchor(null); }}>
              <TableChart sx={{ mr: 1, fontSize: 18 }} /> Toggle Table View
            </MenuItem>
          </Menu>
        </Grid>

        {/* CSI Bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: 420, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Customer Satisfaction (CSI)</Typography>
              <IconButton size="small" onClick={(e) => setCsiMenuAnchor(e.currentTarget)}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Info banner */}
            <Box sx={{ mb: 2, px: 1.5, py: 1, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="success.dark" fontWeight="600">
                ✓ All departments above industry benchmark (90)
              </Typography>
              <Chip size="small" label={`Avg: 95.3`} color="success" />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={csiData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                    tick={{ fill: '#0f172a', fontWeight: 600, fontSize: 13 }} width={65}
                  />
                  <ReTooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={TooltipStyle}
                    formatter={(value, name) => [
                      `${value} / 100`,
                      name === 'score' ? 'CSI Score' : 'Benchmark'
                    ]}
                  />
                  <Legend formatter={(v) => v === 'score' ? 'CSI Score' : 'Industry Benchmark'} />
                  <Bar dataKey="score" name="score" fill="#10b981" radius={[0, 6, 6, 0]} barSize={22}>
                    {csiData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.score >= 95 ? '#10b981' : '#f59e0b'}
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="benchmark" name="benchmark" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* CSI context menu */}
          <Menu anchorEl={csiMenuAnchor} open={Boolean(csiMenuAnchor)} onClose={() => setCsiMenuAnchor(null)}>
            <MenuItem onClick={() => { handleExportCSV('CSI_Scores'); setCsiMenuAnchor(null); }}>
              <Download sx={{ mr: 1, fontSize: 18 }} /> Export CSV
            </MenuItem>
            <MenuItem onClick={() => { showSnack('CSI data refreshed.'); setCsiMenuAnchor(null); }}>
              <Refresh sx={{ mr: 1, fontSize: 18 }} /> Refresh Data
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { showSnack('Benchmark line: Industry average is 90/100'); setCsiMenuAnchor(null); }}>
              <BarChartIcon sx={{ mr: 1, fontSize: 18 }} /> Show Benchmark Details
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* ── ROW 3: Radar Chart ─────────────────────────────────── */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Dealership Health Radar</Typography>
                <Typography variant="caption" color="text.secondary">Composite score across 6 key dimensions</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<Download />}
                onClick={() => handleExportCSV('Health_Radar')}
              >
                Export
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#0f172a', fontWeight: 600, fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickCount={4} />
                <Radar name="Score" dataKey="A" stroke="#1a365d" fill="#1a365d" fillOpacity={0.25} />
                <ReTooltip contentStyle={TooltipStyle} formatter={(v) => [`${v}/100`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Department Scorecard</Typography>
                <Typography variant="caption" color="text.secondary">Click any row to drill down</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<Download />}
                onClick={() => handleExportCSV('Department_Scorecard')}
              >
                Export
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', bgcolor: 'background.default' } }}>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">CSI</TableCell>
                    <TableCell align="right">Autom.</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Sales',   rev: '$1.62M', csi: 96, auto: 85, status: 'Exceeding' },
                    { name: 'Service', rev: '$540K',  csi: 92, auto: 62, status: 'On Track' },
                    { name: 'F&I',     rev: '$180K',  csi: 98, auto: 78, status: 'Exceeding' },
                    { name: 'Parts',   rev: '$360K',  csi: 90, auto: 94, status: 'On Track' },
                  ].map((row, i) => (
                    <TableRow key={i} hover sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                      onClick={() => showSnack(`${row.name} dept: CSI ${row.csi}, Automation ${row.auto}%, Revenue ${row.rev}`)}
                    >
                      <TableCell fontWeight="bold">{row.name}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{row.rev}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color={row.csi >= 95 ? 'success.main' : 'warning.main'} fontWeight="bold">
                          {row.csi}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row.auto}%</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small" label={row.status}
                          color={row.status === 'Exceeding' ? 'success' : 'primary'}
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ── LEADERBOARD DIALOG ───────────────────────────────────── */}
      <Dialog open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1.5, py: 2.5 }}>
          <EmojiEvents sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">Full Leaderboard — {period}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>All performers ranked by CSI score</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setLeaderboardOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Top 3 podium */}
          <Box sx={{ p: 3, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="flex-end">
              {[allPerformers[1], allPerformers[0], allPerformers[2]].map((p, i) => {
                const isFirst = i === 1;
                return (
                  <Grid size={{ xs: 4 }} key={p.rank}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ width: isFirst ? 64 : 48, height: isFirst ? 64 : 48, bgcolor: p.color, fontSize: isFirst ? '1.5rem' : '1.1rem', mx: 'auto', mb: 1, border: isFirst ? '3px solid #f59e0b' : 'none', boxShadow: isFirst ? '0 0 20px rgba(245,158,11,0.4)' : 'none' }}>
                        {p.avatar}
                      </Avatar>
                      <Typography variant="caption" display="block">{getRankIcon(p.rank)}</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: isFirst ? '0.95rem' : '0.8rem' }}>{p.name.split(' ')[0]}</Typography>
                      <Chip size="small" label={`CSI ${p.score}`} color="success" sx={{ mt: 0.5, fontWeight: 700 }} />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Full table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'background.default' } }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Units/ROs</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Growth</TableCell>
                  <TableCell align="right">CSI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allPerformers.map((row) => (
                  <TableRow key={row.rank} hover sx={{ cursor: 'pointer' }}
                    onClick={() => { setSelectedEmployee(row); setEmployeeDialogOpen(true); }}
                  >
                    <TableCell><Typography fontWeight="bold">{getRankIcon(row.rank)}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: row.color, fontSize: '0.9rem' }}>{row.avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Click for details</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Chip size="small" label={row.dept} variant="outlined" /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{row.units}</TableCell>
                    <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={row.growth}
                        color={row.trend === 'up' ? 'success' : 'error'}
                        icon={row.trend === 'up' ? <TrendingUp sx={{ fontSize: '14px !important' }} /> : <TrendingDown sx={{ fontSize: '14px !important' }} />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="success.main" fontWeight="bold">{row.score}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button startIcon={<Download />} variant="outlined" onClick={() => handleExportCSV('Full_Leaderboard')}>
            Export CSV
          </Button>
          <Button variant="contained" onClick={() => setLeaderboardOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── EMPLOYEE DETAIL DIALOG ───────────────────────────────── */}
      <Dialog open={employeeDialogOpen} onClose={() => setEmployeeDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedEmployee && (
          <>
            <DialogTitle sx={{ bgcolor: selectedEmployee.color, color: 'white', display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
              <Avatar sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '1.3rem', border: '2px solid rgba(255,255,255,0.4)' }}>
                {selectedEmployee.avatar}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">{selectedEmployee.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>{selectedEmployee.dept} Department • Rank #{selectedEmployee.rank}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => setEmployeeDialogOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2.5}>
                {[
                  { label: 'CSI Score', value: `${selectedEmployee.score} / 100`, color: 'success.main' },
                  { label: 'Units / ROs', value: selectedEmployee.units, color: 'primary.main' },
                  { label: 'Revenue Generated', value: `$${selectedEmployee.revenue.toLocaleString()}`, color: '#8b5cf6' },
                  { label: 'Growth vs Last Month', value: selectedEmployee.growth, color: selectedEmployee.trend === 'up' ? 'success.main' : 'error.main' },
                ].map((m, i) => (
                  <Grid size={{ xs: 6 }} key={i}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>
                        {m.label}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: m.color, mt: 0.5 }}>
                        {m.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {selectedEmployee.rank <= 3 && (
                <Box sx={{ mt: 2.5, p: 2, bgcolor: 'rgba(245,158,11,0.08)', borderRadius: 2, border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WorkspacePremium sx={{ color: '#f59e0b', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="#b45309">Top 3 Performer — Period Award</Typography>
                    <Typography variant="caption" color="text.secondary">Eligible for performance bonus this quarter</Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button variant="outlined" onClick={() => { showSnack(`Sending recognition to ${selectedEmployee.name}`); setEmployeeDialogOpen(false); }}>
                Send Recognition 🏅
              </Button>
              <Button variant="contained" onClick={() => setEmployeeDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── SNACKBAR ─────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 2 }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KPIAnalytics;
