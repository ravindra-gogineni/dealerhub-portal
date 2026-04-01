import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment,
  TextField, Typography, Link, Alert, Chip, CircularProgress, Divider
} from '@mui/material';
import { 
  Visibility, VisibilityOff, DirectionsCar, Speed, Security,
  TrendingUp, SupportAgent, CheckCircle, Shield, ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const features = [
  { icon: Speed, title: 'Real-Time Inventory Sync', desc: 'Live pipeline from factory floor to showroom lot with instant updates' },
  { icon: TrendingUp, title: 'AI-Powered Analytics', desc: 'Gemini AI forecasting, KPI tracking and executive reporting' },
  { icon: Security, title: 'Digital F&I Decisioning', desc: 'Instant credit bureau pulls, product menus and e-signatures' },
  { icon: SupportAgent, title: 'Service Lane CRM', desc: 'Smart appointment scheduling, RO tracking & parts management' },
];

const stats = [
  { value: '1,200+', label: 'Dealerships' },
  { value: '98.7%', label: 'Uptime SLA' },
  { value: '$2.4B', label: 'Deals Processed' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: 'admin@dealerhub.com', password: 'password', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email address';
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (formData.password.length < 6) tempErrors.password = 'Min. 6 characters required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        if (formData.email === 'admin@dealerhub.com' && formData.password === 'password') {
          login({ name: 'Alex Admin', email: formData.email, role: 'Dealership Manager', avatar: '' });
          navigate('/dashboard');
        } else {
          setLoginError('Invalid credentials. Use: admin@dealerhub.com / password');
          setIsLoading(false);
        }
      }, 1200);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ─────────── LEFT PANEL ─────────── */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(160deg, #0f172a 0%, #1a365d 40%, #0ea5e9 120%)',
        p: 6,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Background Orbs */}
        <Box sx={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -80, left: -80,
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
        {/* Grid pattern overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              p: 1.2, borderRadius: 2,
              display: 'flex',
            }}>
              <DirectionsCar sx={{ color: '#38bdf8', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="800" color="white" letterSpacing={-0.5}>
                DealerHub
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 3, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                Automotive Portal
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Tagline */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            label="✦ Industry-Leading DMS Platform"
            size="small"
            sx={{ bgcolor: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', mb: 3, fontWeight: 600, fontSize: '0.7rem' }}
          />
          <Typography variant="h3" fontWeight="800" color="white" sx={{ lineHeight: 1.15, mb: 2, fontSize: { md: '2rem', lg: '2.5rem' } }}>
            The Future of
            <br />
            <Box component="span" sx={{ color: '#38bdf8' }}>Automotive Retail</Box>
            <br />
            Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 400, lineHeight: 1.7 }}>
            One intelligent platform to manage inventory, sales, finance, and service operations across your entire dealership network.
          </Typography>

          {/* Animated Feature Ticker */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', minHeight: 90 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Box
                  key={i}
                  sx={{
                    display: i === activeFeature ? 'flex' : 'none',
                    alignItems: 'flex-start',
                    gap: 2,
                    animation: 'fadeIn 0.5s ease',
                    '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                  }}
                >
                  <Box sx={{ p: 1, bgcolor: 'rgba(56,189,248,0.15)', borderRadius: 1.5, mt: 0.3 }}>
                    <Icon sx={{ color: '#38bdf8', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight="700" color="white" variant="body2">{f.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f.desc}</Typography>
                  </Box>
                </Box>
              );
            })}
            {/* Dots */}
            <Box sx={{ display: 'flex', gap: 0.8, mt: 2 }}>
              {features.map((_, i) => (
                <Box key={i} onClick={() => setActiveFeature(i)} sx={{ cursor: 'pointer', width: i === activeFeature ? 20 : 6, height: 6, borderRadius: 10, bgcolor: i === activeFeature ? '#38bdf8' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 4 }}>
            {stats.map((s, i) => (
              <Box key={i}>
                <Typography variant="h5" fontWeight="800" color="white">{s.value}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─────────── RIGHT PANEL - LOGIN FORM ─────────── */}
      <Box sx={{
        width: { xs: '100%', md: 480 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: { xs: 4, md: 6 },
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Top-right badge */}
        <Box sx={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 0.7 }}>
          <Shield sx={{ fontSize: 14, color: 'success.main' }} />
          <Typography variant="caption" color="success.main" fontWeight="600">256-bit SSL Secured</Typography>
        </Box>

        {/* Mobile: show branding */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5, display: 'flex' }}>
            <DirectionsCar sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="primary.main">DealerHub Portal</Typography>
        </Box>

        <Box sx={{ maxWidth: 380, width: '100%', mx: 'auto' }}>
          <Typography variant="h4" fontWeight="800" color="#0f172a" sx={{ mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your dealership management account
          </Typography>

          {/* Demo credentials hint */}
          <Box sx={{
            p: 2, mb: 3, borderRadius: 2,
            bgcolor: 'rgba(14,165,233,0.06)',
            border: '1px solid rgba(14,165,233,0.2)',
            display: 'flex', alignItems: 'flex-start', gap: 1.5
          }}>
            <CheckCircle sx={{ color: '#0ea5e9', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" fontWeight="700" color="#0ea5e9" sx={{ display: 'block', mb: 0.3 }}>DEMO CREDENTIALS</Typography>
              <Typography variant="caption" color="text.secondary">
                Email: <strong>admin@dealerhub.com</strong><br />
                Password: <strong>password</strong>
              </Typography>
            </Box>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: '0.8rem' }}>
              {loginError}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.8 }}>
              Email Address
            </Typography>
            <TextField
              required fullWidth id="email" name="email"
              placeholder="admin@dealerhub.com"
              autoComplete="email" autoFocus
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={!!errors.email} helperText={errors.email}
              sx={{ mb: 2.5 }}
              InputProps={{ sx: { borderRadius: 2, bgcolor: 'white', fontSize: '0.9rem' } }}
            />

            <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.8 }}>
              Password
            </Typography>
            <TextField
              required fullWidth name="password" label=""
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              id="password" autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={!!errors.password} helperText={errors.password}
              sx={{ mb: 1 }}
              InputProps={{
                sx: { borderRadius: 2, bgcolor: 'white', fontSize: '0.9rem' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(s => !s)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox size="small" checked={formData.rememberMe}
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" color="text.secondary">Keep me signed in</Typography>}
              />
              <Link href="#" variant="body2" fontWeight="600" color="primary" underline="hover" sx={{ fontSize: '0.82rem' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit" fullWidth variant="contained"
              disabled={isLoading}
              endIcon={isLoading ? null : <ArrowForward />}
              sx={{
                py: 1.6, borderRadius: 2, fontSize: '0.95rem', fontWeight: 700,
                background: isLoading ? undefined : 'linear-gradient(135deg, #1a365d 0%, #0ea5e9 100%)',
                boxShadow: '0 8px 24px rgba(26,54,93,0.35)',
                '&:hover': { boxShadow: '0 12px 32px rgba(26,54,93,0.45)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={18} color="inherit" />
                  Authenticating...
                </Box>
              ) : 'Sign In to Portal'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.disabled">OR</Typography>
            </Divider>

            {/* SSO / Request Access */}
            <Button
              fullWidth variant="outlined"
              sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, color: 'text.secondary', borderColor: '#e2e8f0', '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'transparent' } }}
              onClick={() => alert('SSO / Microsoft Entra login coming soon')}
            >
              🏢 &nbsp; Single Sign-On (SSO)
            </Button>

            <Box sx={{ mt: 4, textAlign: 'center', p: 2.5, bgcolor: '#f1f5f9', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Don't have access?{' '}
                <Link href="#" fontWeight="700" color="primary" underline="hover">Request Dealer Account</Link>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom Version */}
        <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled" sx={{ letterSpacing: 1.5 }}>
            DEALERHUB PORTAL v2.0.4 • © 2026 DEALERHUB TECHNOLOGIES
          </Typography>
        </Box>
      </Box>

      {/* Global CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
      `}</style>
    </Box>
  );
};

export default Login;
