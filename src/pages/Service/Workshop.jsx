import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, AvatarGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Menu, Divider, Grid, Chip
} from '@mui/material';
import { Add, MoreVert, Visibility, Delete, Person, DirectionsCar, AccessTime, Engineering, Assignment, Info } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const Workshop = () => {
  const { appointments, addAppointment, updateAppointmentStatus, deleteAppointment } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ time: '02:00 PM', customer: '', vehicle: '', advisor: 'Sarah J.', type: 'Maintenance' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleStatusUpdate = (status) => {
    updateAppointmentStatus(selectedId, status);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteAppointment(selectedId);
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    setAnchorEl(null);
  };

  // Support both NeDB _id and custom id fields
  const selectedAppt = appointments.find(a => (a._id || a.id) === selectedId);

  const handleAddSubmit = () => {
    addAppointment({ ...newAppt, status: 'Pending' });
    setDialogOpen(false);
    setNewAppt({ time: '02:00 PM', customer: '', vehicle: '', advisor: 'Sarah J.', type: 'Maintenance' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Workshop Scheduling</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setDialogOpen(true)}>New Appointment</Button>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" fontWeight="bold">Today's Schedule</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Active Technicians:</Typography>
            <AvatarGroup max={4}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>JD</Avatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>MK</Avatar>
              <Avatar sx={{ bgcolor: 'warning.main' }}>TS</Avatar>
              <Avatar sx={{ bgcolor: 'success.main' }}>PL</Avatar>
              <Avatar>+2</Avatar>
            </AvatarGroup>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell fontWeight="bold">Time</TableCell>
                <TableCell fontWeight="bold">Customer</TableCell>
                <TableCell fontWeight="bold">Vehicle</TableCell>
                <TableCell fontWeight="bold">Service Advisor</TableCell>
                <TableCell fontWeight="bold">Service Type</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((row) => {
                const rowId = row._id || row.id;
                return (
                  <TableRow key={rowId} hover>
                    <TableCell fontWeight="600">{row.time}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.vehicle}</TableCell>
                    <TableCell>{row.advisor}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" color={row.status === 'In Bay' ? 'success' : row.status === 'Completed' ? 'primary' : 'warning'}>
                        {row.status}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, rowId)}><MoreVert /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleViewDetails}><Visibility sx={{ mr: 1, fontSize: 20 }} /> View Details</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleStatusUpdate('In Bay')}>Move to Bay</MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Completed')}>Mark Completed</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1, fontSize: 20 }} /> Delete</MenuItem>
        </Menu>
      </Paper>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Appointment</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Time" fullWidth value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
            <TextField label="Customer Name" fullWidth value={newAppt.customer} onChange={e => setNewAppt({...newAppt, customer: e.target.value})} />
            <TextField label="Vehicle" fullWidth value={newAppt.vehicle} onChange={e => setNewAppt({...newAppt, vehicle: e.target.value})} />
            <TextField select label="Service Advisor" fullWidth value={newAppt.advisor} onChange={e => setNewAppt({...newAppt, advisor: e.target.value})}>
              <MenuItem value="Sarah J.">Sarah J.</MenuItem>
              <MenuItem value="Mike R.">Mike R.</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}>Book Appointment</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          py: 2
        }}>
          <Assignment />
          <Typography variant="h6" fontWeight="bold">Appointment Details</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip 
            label={selectedAppt?.id ? `ID: ${selectedAppt.id}` : ''} 
            size="small" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} 
          />
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedAppt && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Status Banner */}
              <Box sx={{ 
                px: 3, py: 1.5, 
                bgcolor: selectedAppt.status === 'In Bay' ? 'success.light' : selectedAppt.status === 'Completed' ? 'primary.light' : 'warning.light',
                color: selectedAppt.status === 'In Bay' ? 'success.dark' : selectedAppt.status === 'Completed' ? 'primary.dark' : 'warning.dark',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Info sx={{ fontSize: 20 }} />
                <Typography variant="body2" fontWeight="bold">Current Status: {selectedAppt.status}</Typography>
              </Box>

              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Section: Customer */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Person color="primary" sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                      Customer Information
                    </Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">{selectedAppt.customer}</Typography>
                    <Typography variant="body2" color="text.secondary">Primary Account Holder</Typography>
                  </Paper>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    {/* Section: Vehicle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <DirectionsCar color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                        Vehicle
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">{selectedAppt.vehicle}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* Section: Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <AccessTime color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                        Scheduled Time
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">{selectedAppt.time}</Typography>
                  </Grid>
                </Grid>

                <Divider />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    {/* Section: Service */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Engineering color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                        Service Type
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">{selectedAppt.type}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* Section: Advisor */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Avatar sx={{ width: 20, height: 20, bgcolor: 'secondary.main', fontSize: 10 }}>{selectedAppt.advisor.charAt(0)}</Avatar>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                        Service Advisor
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="600">{selectedAppt.advisor}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button 
            onClick={() => setDetailsOpen(false)} 
            variant="contained" 
            sx={{ px: 4, borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workshop;
