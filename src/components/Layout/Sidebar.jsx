import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Typography,
  Collapse,
  Toolbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as DirectionsCarIcon,
  AttachMoney as AttachMoneyIcon,
  Build as BuildIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Sync as SyncIcon,
  LocalOffer as LocalOfferIcon, // Changed from AppraisalIcon to LocalOfferIcon (MUI Material doesn't have AppraisalIcon)
  People as PeopleIcon,
  Calculate as CalculateIcon,
  MonetizationOn as MonetizationOnIcon,
  EventNote as EventNoteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({
    inventory: true,
    sales: true,
    service: true,
  });

  const handleToggle = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path;

  // Add robust matching so a menu item stays selected if we are on that path.

  const navItems = [
    { type: 'item', title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { type: 'divider' },
    { type: 'header', title: 'OPERATIONS' },
    { 
      type: 'group', 
      title: 'Inventory Management', 
      icon: <DirectionsCarIcon />,
      key: 'inventory',
      children: [
        { title: 'Real-Time Sync', icon: <SyncIcon sx={{ fontSize: 20 }}/>, path: '/inventory/realtime-status' },
        { title: 'Appraisal', icon: <LocalOfferIcon sx={{ fontSize: 20 }}/>, path: '/inventory/appraisal' },
        { title: 'Analytics', icon: <BarChartIcon sx={{ fontSize: 20 }}/>, path: '/inventory/analytics' },
      ]
    },
    { 
      type: 'group', 
      title: 'Sales & Deal', 
      icon: <AttachMoneyIcon />,
      key: 'sales',
      children: [
        { title: 'Lead Management', icon: <PeopleIcon sx={{ fontSize: 20 }}/>, path: '/sales/leads' },
        { title: 'Interactive Desking', icon: <CalculateIcon sx={{ fontSize: 20 }}/>, path: '/sales/desking' },
        { title: 'F&I Integration', icon: <MonetizationOnIcon sx={{ fontSize: 20 }}/>, path: '/sales/finance' },
      ]
    },
    { 
      type: 'group', 
      title: 'Service & Parts', 
      icon: <BuildIcon />,
      key: 'service',
      children: [
        { title: 'Workshop Scheduling', icon: <EventNoteIcon sx={{ fontSize: 20 }}/>, path: '/service/workshop' },
        { title: 'Parts Inventory', icon: <InventoryIcon sx={{ fontSize: 20 }}/>, path: '/service/parts' },
      ]
    },
    { type: 'divider' },
    { type: 'header', title: 'MANAGEMENT' },
    { type: 'item', title: 'KPI Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { type: 'item', title: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0f172a', color: '#cbd5e1' }}>
      <Toolbar sx={{ backgroundColor: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.05)', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
          DealerHub Portal
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List sx={{ pt: 2, pb: 2 }}>
          {navItems.map((item, index) => {
            if (item.type === 'divider') {
              return <Divider key={`div-${index}`} sx={{ my: 1 }} />;
            }
            if (item.type === 'header') {
              return (
                <Typography 
                  key={`head-${index}`} 
                  variant="caption" 
                  sx={{ px: 3, pt: 1, pb: 0.5, display: 'block', color: '#64748b', fontWeight: 'bold' }}
                >
                  {item.title}
                </Typography>
              );
            }
            if (item.type === 'item') {
              const active = isActive(item.path);
              return (
                <ListItem key={item.title} disablePadding sx={{ px: 1 }}>
                  <ListItemButton 
                    onClick={() => navigate(item.path)}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 0.5,
                      backgroundColor: active ? 'primary.main' : 'transparent',
                      color: active ? '#fff' : '#cbd5e1',
                      '&:hover': {
                        backgroundColor: active ? 'primary.main' : 'rgba(255,255,255,0.04)',
                        color: '#fff'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: active ? '#fff' : '#94a3b8', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 400 }} />
                  </ListItemButton>
                </ListItem>
              );
            }
            if (item.type === 'group') {
              const open = openMenus[item.key];
              return (
                <Box key={item.title} sx={{ px: 1 }}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => handleToggle(item.key)}
                      sx={{ 
                        borderRadius: 2, 
                        mb: 0.5, 
                        color: '#cbd5e1',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => {
                        const active = isActive(child.path);
                        return (
                          <ListItemButton 
                            key={child.title} 
                            sx={{ 
                              pl: 4, 
                              mb: 0.5, 
                              borderRadius: 2,
                              backgroundColor: active ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                              color: active ? '#fff' : '#94a3b8',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                color: '#fff'
                              }
                            }}
                            onClick={() => navigate(child.path)}
                          >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText primary={child.title} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: active ? 600 : 400 }} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }
            return null;
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', backgroundColor: '#0f172a' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
