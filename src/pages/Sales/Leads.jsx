import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Menu, MenuItem, Divider
} from '@mui/material';
import { Phone, Email, Language, MoreVert, Schedule, Delete, Visibility, AutoAwesome, Refresh } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const getSourceIcon = (source) => {
  switch(source) {
    case 'Web': return <Language fontSize="small" color="primary" />;
    case 'Phone': return <Phone fontSize="small" color="secondary" />;
    case 'Autotrader': return <Language fontSize="small" color="warning" />;
    default: return <Email fontSize="small" />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'New': return 'error';
    case 'In Progress': return 'primary';
    case 'Contacted': return 'secondary';
    case 'Qualified': return 'success';
    case 'Needs Follow-up': return 'warning';
    default: return 'default';
  }
};

const Leads = () => {
  const { leads, addLead, updateLeadStatus, deleteLead, aiInsights, fetchAIInsights, loading } = useData();
  const [aiLoading, setAiLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', vehicle: '', source: 'Web', status: 'New', followUp: 'Today' });
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleAddSubmit = () => {
    addLead(newLead);
    setDialogOpen(false);
    setNewLead({ name: '', vehicle: '', source: 'Web', status: 'New', followUp: 'Today' });
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedLeadId(id);
  };

  const handleStatusUpdate = (status) => {
    updateLeadStatus(selectedLeadId, status);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteLead(selectedLeadId);
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    setAnchorEl(null);
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Omnichannel Lead Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={aiLoading ? <Refresh className="rotate" /> : <AutoAwesome />} 
            onClick={async () => {
              setAiLoading(true);
              await fetchAIInsights('leads');
              setAiLoading(false);
            }}
            disabled={aiLoading}
          >
            {aiLoading ? 'Analyzing...' : 'Generate AI Insights'}
          </Button>
          <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Assign Leads</Button>
        </Box>
      </Box>

      {aiInsights.leads && (
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
            <Typography variant="h6" fontWeight="bold">Gemini AI Lead Insights</Typography>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'rgba(255,255,255,0.8)' }}>
            {aiInsights.leads}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: 'background.default' }}>
              <TableRow>
                <TableCell fontWeight="bold">Lead Information</TableCell>
                <TableCell fontWeight="bold">Vehicle of Interest</TableCell>
                <TableCell fontWeight="bold">Source</TableCell>
                <TableCell fontWeight="bold">Status</TableCell>
                <TableCell fontWeight="bold">Time in System</TableCell>
                <TableCell fontWeight="bold">Next Action</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.875rem' }}>
                        {row.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.vehicle}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSourceIcon(row.source)}
                      <Typography variant="body2">{row.source}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} color={getStatusColor(row.status)} />
                  </TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: row.followUp === 'Overdue' ? 'error.main' : 'text.primary' }}>
                      <Schedule fontSize="small" />
                      <Typography variant="body2" fontWeight={row.followUp === 'Overdue' ? 'bold' : 'normal'}>
                        {row.followUp}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
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
          <MenuItem onClick={() => handleStatusUpdate('In Progress')}>Mark In Progress</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Contacted')}>Mark Contacted</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Qualified')}>Mark Qualified</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Closed')}>Close Lead</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1, fontSize: 20 }} /> Delete</MenuItem>
        </Menu>
      </Paper>

      {/* Add Lead Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign New Lead</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Customer Name" fullWidth value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
            <TextField label="Vehicle of Interest" fullWidth value={newLead.vehicle} onChange={e => setNewLead({...newLead, vehicle: e.target.value})} />
            <TextField select label="Lead Source" fullWidth value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})}>
              <MenuItem value="Web">Web</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="Autotrader">Autotrader</MenuItem>
              <MenuItem value="Walk-in">Walk-in</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}>Create Lead</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lead Detail View</DialogTitle>
        <DialogContent dividers>
          {selectedLead && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">ID: {selectedLead.id}</Typography>
              <Typography variant="h6"><strong>Name:</strong> {selectedLead.name}</Typography>
              <Typography><strong>Vehicle:</strong> {selectedLead.vehicle}</Typography>
              <Typography><strong>Source:</strong> {selectedLead.source}</Typography>
              <Typography><strong>Status:</strong> <Chip size="small" label={selectedLead.status} color={getStatusColor(selectedLead.status)} /></Typography>
              <Typography><strong>Follow-up:</strong> {selectedLead.followUp}</Typography>
              <Typography><strong>Time in System:</strong> {selectedLead.time}</Typography>
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

export default Leads;
