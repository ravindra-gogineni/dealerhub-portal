import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Menu, Divider
} from '@mui/material';
import { Search, FilterList, Refresh, MoreVert, Visibility, Delete, AutoAwesome } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const getStatusColor = (status) => {
  switch(status) {
    case 'Delivered': return 'success';
    case 'In Transit': return 'primary';
    case 'At Factory': return 'warning';
    case 'Scheduled': return 'default';
    default: return 'default';
  }
};

const RealtimeStatus = () => {
  const { inventory, addInventoryItem, updateInventoryStatus, showNotification, deleteInventoryItem, aiInsights, fetchAIInsights } = useData();
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ make: '', model: '', year: new Date().getFullYear(), orderType: 'Customer' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const filteredData = inventory.filter(v => {
    const matchesSearch = v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeStatus === 'All' || v.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = () => {
    addInventoryItem({
      ...newOrder,
      id: `VIN${Math.floor(Math.random() * 10000000000)}`,
      status: 'Scheduled',
      expected: 'TBD'
    });
    setDialogOpen(false);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleStatusUpdate = (status) => {
    updateInventoryStatus(selectedId, status);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteInventoryItem(selectedId);
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    setAnchorEl(null);
  };

  const selectedVehicle = inventory.find(v => v.id === selectedId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Real-Time Sync</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={aiLoading ? <Refresh className="rotate" /> : <AutoAwesome />} 
            onClick={async () => {
              setAiLoading(true);
              await fetchAIInsights('inventory');
              setAiLoading(false);
            }}
            disabled={aiLoading}
          >
            {aiLoading ? 'Analyzing...' : 'AI Inventory Insights'}
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => showNotification('Sync complete. Data is up to date.')}>Sync Now</Button>
          <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Add Order</Button>
        </Box>
      </Box>

      {aiInsights.inventory && (
        <Paper 
          sx={{ 
            p: 3, mb: 4, 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <AutoAwesome sx={{ color: '#818cf8' }} />
            <Typography variant="h6" fontWeight="bold">Gemini AI Optimization Tips</Typography>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'rgba(255,255,255,0.8)' }}>
            {aiInsights.inventory}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            size="small"
            placeholder="Search VIN, Make, Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
          <Button 
            variant={activeStatus !== 'All' ? 'contained' : 'outlined'} 
            startIcon={<FilterList />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            {activeStatus === 'All' ? 'Filters' : `Status: ${activeStatus}`}
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem onClick={() => { setActiveStatus('All'); setFilterAnchorEl(null); }}>All Statuses</MenuItem>
            <Divider />
            <MenuItem onClick={() => { setActiveStatus('Scheduled'); setFilterAnchorEl(null); }}>Scheduled</MenuItem>
            <MenuItem onClick={() => { setActiveStatus('At Factory'); setFilterAnchorEl(null); }}>At Factory</MenuItem>
            <MenuItem onClick={() => { setActiveStatus('In Transit'); setFilterAnchorEl(null); }}>In Transit</MenuItem>
            <MenuItem onClick={() => { setActiveStatus('Delivered'); setFilterAnchorEl(null); }}>Delivered</MenuItem>
          </Menu>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: 'background.default' }}>
              <TableRow>
                <TableCell fontWeight="bold">VIN</TableCell>
                <TableCell fontWeight="bold">Vehicle</TableCell>
                <TableCell fontWeight="bold">Order Type</TableCell>
                <TableCell fontWeight="bold">Status</TableCell>
                <TableCell fontWeight="bold">Expected Delivery</TableCell>
                <TableCell align="right" fontWeight="bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    {row.id}
                  </TableCell>
                  <TableCell><Typography variant="body2" fontWeight="600">{row.year} {row.make} {row.model}</Typography></TableCell>
                  <TableCell><Chip size="small" label={row.orderType} variant={row.orderType === 'Customer' ? 'outlined' : 'filled'} color="secondary" /></TableCell>
                  <TableCell><Chip size="small" label={row.status} color={getStatusColor(row.status)} /></TableCell>
                  <TableCell>{row.expected}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, row.id)}><MoreVert /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleViewDetails}><Visibility sx={{ mr: 1, fontSize: 20 }} /> View Details</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleStatusUpdate('In Transit')}>Mark as In Transit</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Delivered')}>Mark as Delivered</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1, fontSize: 20 }} /> Delete</MenuItem>
        </Menu>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vehicle Order</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Make" fullWidth value={newOrder.make} onChange={e => setNewOrder({...newOrder, make: e.target.value})} />
            <TextField label="Model" fullWidth value={newOrder.model} onChange={e => setNewOrder({...newOrder, model: e.target.value})} />
            <TextField label="Year" type="number" fullWidth value={newOrder.year} onChange={e => setNewOrder({...newOrder, year: e.target.value})} />
            <TextField select label="Order Type" fullWidth value={newOrder.orderType} onChange={e => setNewOrder({...newOrder, orderType: e.target.value})}>
              <MenuItem value="Customer">Customer</MenuItem>
              <MenuItem value="Stock">Stock</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}>Create Order</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vehicle Details</DialogTitle>
        <DialogContent dividers>
          {selectedVehicle && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">VIN: {selectedVehicle.id}</Typography>
              <Typography variant="h6"><strong>Vehicle:</strong> {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</Typography>
              <Typography><strong>Order Type:</strong> {selectedVehicle.orderType}</Typography>
              <Typography><strong>Status:</strong> <Chip size="small" label={selectedVehicle.status} color={getStatusColor(selectedVehicle.status)} /></Typography>
              <Typography><strong>Expected Delivery:</strong> {selectedVehicle.expected}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RealtimeStatus;
