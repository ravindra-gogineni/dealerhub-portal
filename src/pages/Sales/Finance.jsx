import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Checkbox, FormControlLabel, Button, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { TaskAlt, Description, Create } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const Finance = () => {
  const { showNotification, formatPrice } = useData();
  const [products, setProducts] = useState({ gap: false, warranty: true, maintenance: false, protection: false });

  const toggleProduct = (name) => setProducts({ ...products, [name]: !products[name] });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">F&I Integration</Typography>
        <Typography color="text.secondary">Digital credit decisioning and product menu presentations</Typography>
      </Box>

      <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">Credit Decision Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', bgcolor: 'success.light', px: 2, py: 1, borderRadius: 2 }}>
                <TaskAlt sx={{ mr: 1 }} />
                <Typography fontWeight="bold">Approved - Tier 1</Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography color="text.secondary" variant="body2">Bureau Score</Typography>
                <Typography variant="h6" fontWeight="bold">784</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography color="text.secondary" variant="body2">Approved Term</Typography>
                <Typography variant="h6" fontWeight="bold">60 Months</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography color="text.secondary" variant="body2">Buy Rate</Typography>
                <Typography variant="h6" fontWeight="bold">4.99%</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography color="text.secondary" variant="body2">Max Advance</Typography>
                <Typography variant="h6" fontWeight="bold">115%</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 4, height: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>F&I Product Menu</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderColor: products.warranty ? 'primary.main' : 'divider', height: '100%' }}>
                  <CardContent>
                    <FormControlLabel control={<Checkbox checked={products.warranty} onChange={() => toggleProduct('warranty')} />} label={<Typography fontWeight="bold">Extended Service Contract</Typography>} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>Adds 48 months or 50,000 miles of comprehensive coverage. +{formatPrice(35)}/mo</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderColor: products.gap ? 'primary.main' : 'divider', height: '100%' }}>
                  <CardContent>
                    <FormControlLabel control={<Checkbox checked={products.gap} onChange={() => toggleProduct('gap')} />} label={<Typography fontWeight="bold">GAP Protection</Typography>} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>Covers the difference between vehicle value and loan balance. +{formatPrice(12)}/mo</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderColor: products.maintenance ? 'primary.main' : 'divider', height: '100%' }}>
                  <CardContent>
                    <FormControlLabel control={<Checkbox checked={products.maintenance} onChange={() => toggleProduct('maintenance')} />} label={<Typography fontWeight="bold">Prepaid Maintenance</Typography>} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>Includes oil changes, tire rotations for 3 years. +{formatPrice(22)}/mo</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ borderColor: products.protection ? 'primary.main' : 'divider', height: '100%' }}>
                  <CardContent>
                    <FormControlLabel control={<Checkbox checked={products.protection} onChange={() => toggleProduct('protection')} />} label={<Typography fontWeight="bold">Interior/Exterior Protection</Typography>} />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>Ceramic coating and interior stain defense. +{formatPrice(18)}/mo</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight="bold">Document Center</Typography>
            </Box>
            <List sx={{ px: 2, py: 1, flexGrow: 1 }}>
              <ListItem>
                <ListItemIcon><Description color="primary" /></ListItemIcon>
                <ListItemText primary="Retail Installment Contract" secondary="Ready for signature" />
                <Button size="small" variant="outlined" onClick={() => showNotification("Opening Contract PDF Viewer...")}>View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Description color="primary" /></ListItemIcon>
                <ListItemText primary="Odometer Disclosure" secondary="Ready for signature" />
                <Button size="small" variant="outlined" onClick={() => showNotification("Opening Form PDF Viewer...")}>View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Description sx={{ color: 'text.disabled' }} /></ListItemIcon>
                <ListItemText primary="Extended Warranty Contract" secondary={products.warranty ? 'Ready for signature' : 'Pending Selection'} />
              </ListItem>
            </List>
            <Box sx={{ p: 3, pt: 1, mt: 'auto' }}>
              <Button variant="contained" color="secondary" fullWidth size="large" startIcon={<Create />} onClick={() => showNotification("Launching digital signature package provider...")}>
                Launch e-Sign Session
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Finance;
