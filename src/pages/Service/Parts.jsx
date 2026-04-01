import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Menu, Divider
} from '@mui/material';
import { ShoppingCart, MoreVert, Visibility, Delete } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const Parts = () => {
  const { parts, orderParts, deletePart, formatPrice } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderParams, setOrderParams] = useState({ id: 'PT-10025', qty: 20 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleAddSubmit = () => {
    orderParts(orderParams.id, Number(orderParams.qty));
    setDialogOpen(false);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleDelete = () => {
    deletePart(selectedId);
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    setAnchorEl(null);
  };

  const selectedPart = parts.find(p => p.id === selectedId);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Parts Inventory</Typography>
        <Button variant="contained" color="secondary" startIcon={<ShoppingCart />} onClick={() => setDialogOpen(true)}>Create Purchase Order</Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>Real-time Stock Tracking</Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell fontWeight="bold">Part Number</TableCell>
                <TableCell fontWeight="bold">Description</TableCell>
                <TableCell fontWeight="bold">OEM Catalog</TableCell>
                <TableCell align="right" fontWeight="bold">On Hand</TableCell>
                <TableCell align="right" fontWeight="bold">Unit Price</TableCell>
                <TableCell align="center" fontWeight="bold">Status</TableCell>
                <TableCell align="center" fontWeight="bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parts.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell fontWeight="600" sx={{ fontFamily: 'monospace' }}>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.oem}</TableCell>
                  <TableCell align="right" sx={{ color: row.qty < row.minQty ? 'error.main' : 'inherit', fontWeight: row.qty < row.minQty ? 'bold' : 'normal' }}>
                    {row.qty}
                  </TableCell>
                  <TableCell align="right">{formatPrice(row.price)}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={row.status} color={row.status === 'Low Stock' ? 'error' : row.status === 'In Stock' ? 'success' : 'warning'} />
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
          <MenuItem onClick={() => {
            setOrderParams({ id: selectedId, qty: 10 });
            setDialogOpen(true);
            setAnchorEl(null);
          }}>Quick Order (+10)</MenuItem>
          <Divider />
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}><Delete sx={{ mr: 1, fontSize: 20 }} /> Delete</MenuItem>
        </Menu>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Issue Purchase Order (Vendor)</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField select label="Select Part" fullWidth value={orderParams.id} onChange={e => setOrderParams({...orderParams, id: e.target.value})}>
              {parts.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.id} - {p.name}</MenuItem>
              ))}
            </TextField>
            <TextField 
              label="Quantity" 
              type="number" 
              fullWidth 
              value={orderParams.qty} 
              onChange={e => setOrderParams({...orderParams, qty: parseInt(e.target.value) || 0})} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}>Submit PO</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Part Details</DialogTitle>
        <DialogContent dividers>
          {selectedPart && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">ID: {selectedPart.id}</Typography>
              <Typography variant="h6"><strong>Name:</strong> {selectedPart.name}</Typography>
              <Typography><strong>OEM/Brand:</strong> {selectedPart.oem}</Typography>
              <Typography><strong>Quantity On Hand:</strong> {selectedPart.qty}</Typography>
              <Typography><strong>Minimum Threshold:</strong> {selectedPart.minQty}</Typography>
              <Typography><strong>Price:</strong> {formatPrice(selectedPart.price)}</Typography>
              <Typography><strong>Status:</strong> <Chip size="small" label={selectedPart.status} color={selectedPart.status === 'Low Stock' ? 'error' : selectedPart.status === 'In Stock' ? 'success' : 'warning'} /></Typography>
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

export default Parts;
