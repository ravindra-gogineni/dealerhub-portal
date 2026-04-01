import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Card, CardContent,
  Slider, ToggleButton, ToggleButtonGroup, Divider, Button
} from '@mui/material';
import { Calculate, RequestQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const Desking = () => {
  const navigate = useNavigate();
  const { saveDeskingDeal, showNotification, formatPrice, currencySymbols, currency } = useData();
  const [dealType, setDealType] = useState('purchase');
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [tradeInValue, setTradeInValue] = useState(5000);
  const [downPayment, setDownPayment] = useState(2000);
  const [termMonths, setTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(5.9);
  const taxRate = 0.0825; // 8.25%

  const [payment, setPayment] = useState(0);

  useEffect(() => {
    const netPrice = vehiclePrice - tradeInValue - downPayment;
    const taxes = netPrice * taxRate;
    const amountFinanced = netPrice + taxes;
    
    if (dealType === 'purchase') {
      const r = (interestRate / 100) / 12;
      const n = termMonths;
      if (r === 0) {
        setPayment(amountFinanced / n);
      } else {
        const pmt = (amountFinanced * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setPayment(pmt > 0 ? pmt : 0);
      }
    } else {
      const residual = vehiclePrice * 0.55;
      const depreciation = (netPrice - residual) / termMonths;
      const moneyFactor = interestRate / 2400; 
      const rentCharge = (netPrice + residual) * moneyFactor;
      const pmt = depreciation + rentCharge;
      setPayment(pmt > 0 ? pmt : 0);
    }
  }, [dealType, vehiclePrice, tradeInValue, downPayment, termMonths, interestRate]);

  const handlePushToFinance = () => {
    saveDeskingDeal({
      dealType,
      netPrice: vehiclePrice - tradeInValue,
      payment,
      termMonths
    });
    navigate('/sales/finance');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Interactive Desking</Typography>
        <Button variant="outlined" color="primary" startIcon={<RequestQuote />} onClick={() => showNotification("Credit pulled. Equifax Score: 745")}>Pull Credit</Button>
      </Box>

      <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                color="primary" value={dealType} exclusive fullWidth
                onChange={(e, val) => val && setDealType(val)}
              >
                <ToggleButton value="purchase" sx={{ py: 1.5, fontWeight: 'bold' }}>Purchase Finance</ToggleButton>
                <ToggleButton value="lease" sx={{ py: 1.5, fontWeight: 'bold' }}>Lease</ToggleButton>
                <ToggleButton value="cash" sx={{ py: 1.5, fontWeight: 'bold' }}>Cash Deal</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Vehicle Selling Price" type="number" 
                  value={vehiclePrice} onChange={e => setVehiclePrice(Number(e.target.value))}
                  InputProps={{ startAdornment: currencySymbols[currency] || '$' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Trade-In Allowance" type="number" 
                  value={tradeInValue} onChange={e => setTradeInValue(Number(e.target.value))}
                  InputProps={{ startAdornment: currencySymbols[currency] || '$' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Cash Down Payment" type="number" 
                  value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
                  InputProps={{ startAdornment: currencySymbols[currency] || '$' }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Interest Rate (APR)" type="number" 
                  value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
                  InputProps={{ endAdornment: '%' }} inputProps={{ step: "0.1" }}
                  disabled={dealType === 'cash'} />
              </Grid>
              <Grid item xs={12}>
                <Typography id="term-slider" gutterBottom>Term Length: {termMonths} Months</Typography>
                <Slider value={termMonths} onChange={(e, val) => setTermMonths(val)}
                  step={12} marks min={24} max={84} disabled={dealType === 'cash'} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.dark', color: 'white', textAlign: 'center' }}>
              <Typography variant="overline" sx={{ fontSize: '1rem', letterSpacing: 1.5 }}>
                {dealType === 'cash' ? 'Total OTD Price' : 'Estimated Monthly Payment'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 1 }}>
                <Typography variant="h2" fontWeight="bold">
                  {dealType === 'cash' ? formatPrice((vehiclePrice - tradeInValue) * (1 + taxRate)) : formatPrice(payment)}
                </Typography>
                {dealType !== 'cash' && <Typography variant="h6" sx={{ alignSelf: 'flex-end', mb: 1.5, ml: 1 }}>/mo</Typography>}
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Deal Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Vehicle Price</Typography>
                <Typography fontWeight="500">{formatPrice(vehiclePrice)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                <Typography>- Trade-in Allowance</Typography>
                <Typography fontWeight="500">-{formatPrice(tradeInValue)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                <Typography>- Down Payment</Typography>
                <Typography fontWeight="500">-{formatPrice(downPayment)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Net Price</Typography>
                <Typography fontWeight="500">{formatPrice(vehiclePrice - tradeInValue - downPayment)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="error.main">+ Est. Taxes & Fees (8.25%)</Typography>
                <Typography fontWeight="500">{formatPrice((vehiclePrice - tradeInValue - downPayment) * taxRate)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography fontWeight="bold">Amount Financed</Typography>
                <Typography fontWeight="bold">{formatPrice((vehiclePrice - tradeInValue - downPayment) * (1 + taxRate))}</Typography>
              </Box>
              
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button variant="contained" color="secondary" fullWidth size="large" startIcon={<Calculate />} onClick={handlePushToFinance}>
                  Save & Push to F&I
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Desking;
