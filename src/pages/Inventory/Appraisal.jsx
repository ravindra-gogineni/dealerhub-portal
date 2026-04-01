import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, MenuItem, Button,
  Card, CardContent, Divider
} from '@mui/material';
import { DirectionsCar, Paid, Speed } from '@mui/icons-material';
import { useData } from '../../context/DataContext';

const conditions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

const Appraisal = () => {
  const { addInventoryItem, showNotification } = useData();
  const [formData, setFormData] = useState({
    vin: '', make: '', model: '', year: '', mileage: '', condition: 'Good'
  });
  const [appraisedValue, setAppraisedValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAppraise = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      let baseValue = 15000;
      if (formData.year > 2020) baseValue += 8000;
      if (formData.mileage < 50000) baseValue += 3000;
      if (formData.condition === 'Excellent') baseValue += 4000;
      if (formData.condition === 'Poor') baseValue -= 5000;
      
      setAppraisedValue({
        tradeIn: baseValue,
        retail: baseValue * 1.3,
        kbb: baseValue * 1.05
      });
      setLoading(false);
    }, 1000);
  };

  const handleApprove = () => {
    addInventoryItem({
      id: formData.vin || `VIN${Math.floor(Math.random()*1000000000)}`,
      make: formData.make || 'Trade-in',
      model: formData.model,
      year: formData.year,
      status: 'At Factory',
      expected: 'In Recon',
      orderType: 'Customer'
    });
    setAppraisedValue(null);
    setFormData({vin: '', make: '', model: '', year: '', mileage: '', condition: 'Good'});
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Used Vehicle Appraisal</Typography>
        <Typography color="text.secondary">Real-time market data integration for trade-in valuations</Typography>
      </Box>

      <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCar color="primary" /> Vehicle Information
            </Typography>
            <Box component="form" onSubmit={handleAppraise} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth label="VIN Number" variant="outlined" 
                    value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})}
                    placeholder="Enter 17-character VIN to auto-decode"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Make" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Model" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth label="Mileage" type="number" 
                    InputProps={{ endAdornment: 'mi' }}
                    value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} 
                    required 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField select fullWidth label="Condition" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} required>
                    {conditions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 4 }}>
                <Button variant="outlined" color="secondary" type="button" onClick={() => setFormData({vin: '', make: '', model: '', year: '', mileage: '', condition: 'Good'})}>
                  Reset
                </Button>
                <Button variant="contained" color="primary" type="submit" size="large" fullWidth disabled={loading}>
                  {loading ? 'Fetching Market Data...' : 'Calculate Appraisal Value'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {appraisedValue ? (
            <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1a365d 0%, #0f172a 100%)', color: 'white' }}>
              <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>Estimated Value</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>Based on current local market data (KBB, Black Book)</Typography>
                
                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" textTransform="uppercase" sx={{ opacity: 0.9 }}>Suggested Trade-In</Typography>
                  <Typography variant="h3" fontWeight="bold" color="#10b981">
                    ${appraisedValue.tradeIn.toLocaleString()}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Expected Retail</Typography>
                      <Typography variant="h6" fontWeight="bold">${appraisedValue.retail.toLocaleString()}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>KBB Market Value</Typography>
                      <Typography variant="h6" fontWeight="bold">${appraisedValue.kbb.toLocaleString()}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 'auto', pt: 4 }}>
                  <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Button variant="contained" color="secondary" fullWidth startIcon={<Paid />} onClick={handleApprove}>
                    Approve for Reconditioning
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={0} sx={{ height: '100%', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Speed sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Ready for Appraisal</Typography>
                <Typography variant="body2" color="text.secondary">Enter vehicle details to generate market valuations.</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Appraisal;
