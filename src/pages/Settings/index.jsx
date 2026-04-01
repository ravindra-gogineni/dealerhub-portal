import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Button,
  Divider,
  Avatar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CheckCircleOutline } from '@mui/icons-material';

const Settings = () => {
  const { user } = useAuth();
  const { showNotification } = useData();
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Admin',
    email: user?.email || 'admin@dealerhub.com',
    role: user?.role || 'Dealership Manager',
    phone: '(555) 123-4567'
  });
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    darkMode: false,
    twoFactor: true
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    showNotification('Profile settings saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePassword = () => {
    showNotification('Password updated successfully!');
  };

  const handleChangeAvatar = () => {
    showNotification('Avatar upload coming soon!');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Account Settings</Typography>
        <Button 
          variant="contained" 
          color={saved ? "success" : "primary"} 
          onClick={handleSave}
          startIcon={saved ? <CheckCircleOutline /> : null}
        >
          {saved ? 'Saved Successfully' : 'Save Changes'}
        </Button>
      </Box>

          <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>Profile Information</Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>A</Avatar>
              <Button variant="outlined" size="small" onClick={handleChangeAvatar}>Change Avatar</Button>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email Address" value={profile.email} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Job Role" value={profile.role} disabled />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>Security & Password</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Current Password" type="password" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}></Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="New Password" type="password" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Confirm New Password" type="password" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" color="primary" onClick={handleUpdatePassword}>Update Password</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>Preferences</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Notifications</Typography>
              <FormControlLabel 
                control={<Switch checked={prefs.emailNotifs} onChange={e => setPrefs({...prefs, emailNotifs: e.target.checked})} color="primary" />} 
                label="Email Notifications" 
                sx={{ display: 'flex', mb: 1 }}
              />
              <FormControlLabel 
                control={<Switch checked={prefs.smsNotifs} onChange={e => setPrefs({...prefs, smsNotifs: e.target.checked})} color="primary" />} 
                label="SMS Alerts" 
                sx={{ display: 'flex' }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Appearance</Typography>
              <FormControlLabel 
                control={<Switch checked={prefs.darkMode} onChange={e => setPrefs({...prefs, darkMode: e.target.checked})} color="primary" />} 
                label="Dark Mode Theme" 
                sx={{ display: 'flex' }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Security</Typography>
              <FormControlLabel 
                control={<Switch checked={prefs.twoFactor} onChange={e => setPrefs({...prefs, twoFactor: e.target.checked})} color="primary" />} 
                label="Two-Factor Authentication" 
                sx={{ display: 'flex' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
