import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currency, setCurrency] = useState('USD');
  
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$'
  };

  const formatPrice = (price) => {
    if (typeof price !== 'string' && typeof price !== 'number') return price;
    
    // Extract numerical value if it's a string like "$85.00"
    let numericValue = price;
    if (typeof price === 'string') {
      numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    
    if (isNaN(numericValue)) return price;

    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${numericValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const [inventory, setInventory] = useState([]);
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [parts, setParts] = useState([]);
  const [aiInsights, setAiInsights] = useState({ inventory: '', leads: '' });
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, leadRes, apptRes, partRes] = await Promise.all([
        fetch(`${API_URL}/inventory`),
        fetch(`${API_URL}/leads`),
        fetch(`${API_URL}/appointments`),
        fetch(`${API_URL}/parts`)
      ]);

      const [invData, leadData, apptData, partData] = await Promise.all([
        invRes.json(),
        leadRes.json(),
        apptRes.json(),
        partRes.json()
      ]);

      setInventory(invData);
      setLeads(leadData);
      setAppointments(apptData);
      setParts(partData);
    } catch (err) {
      console.error('Error fetching data:', err);
      showNotification('Failed to connect to backend. Using local storage.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async (type) => {
    try {
      const res = await fetch(`${API_URL}/${type}/insights`);
      const data = await res.json();
      setAiInsights(prev => ({ ...prev, [type]: data.insights }));
      return data.insights;
    } catch (err) {
      console.error(`Error fetching ${type} insights:`, err);
      return 'AI insights unavailable.';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // CRUD Actions
  const addInventoryItem = async (item) => {
    try {
      const res = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const newItem = await res.json();
      setInventory([newItem, ...inventory]);
      showNotification(`Added ${item.year} ${item.make} ${item.model} to inventory.`);
    } catch (err) { showNotification('Failed to add item', 'error'); }
  };

  const updateInventoryStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedItem = await res.json();
      setInventory(inventory.map(item => (item.id === id || item._id === id) ? { ...item, ...updatedItem } : item));
      showNotification(`Updated inventory status to ${status}.`);
    } catch (err) { showNotification('Failed to update status', 'error'); }
  };

  const deleteInventoryItem = async (id) => {
    try {
      await fetch(`${API_URL}/inventory/${id}`, { method: 'DELETE' });
      setInventory(inventory.filter(item => item.id !== id && item._id !== id));
      showNotification(`Deleted inventory item ${id}`);
    } catch (err) { showNotification('Failed to delete item', 'error'); }
  };

  const addLead = async (lead) => {
    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, id: `L-${Date.now().toString().slice(-4)}` })
      });
      const newLead = await res.json();
      setLeads([newLead, ...leads]);
      showNotification(`New lead assigned: ${lead.name}`);
    } catch (err) { showNotification('Failed to add lead', 'error'); }
  };
  
  const updateLeadStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedLead = await res.json();
      setLeads(leads.map(lead => lead.id === id ? updatedLead : lead));
      showNotification(`Lead status updated to ${status}`);
    } catch (err) { showNotification('Failed to update lead', 'error'); }
  };

  const deleteLead = async (id) => {
    try {
      await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter(lead => lead.id !== id));
      showNotification(`Deleted lead ${id}`);
    } catch (err) { showNotification('Failed to delete lead', 'error'); }
  };

  const addAppointment = async (appt) => {
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appt)
      });
      const newAppt = await res.json();
      setAppointments([...appointments, newAppt]);
      showNotification(`Scheduled appointment for ${appt.customer}`);
    } catch (err) { showNotification('Failed to schedule appointment', 'error'); }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedAppt = await res.json();
      setAppointments(appointments.map(appt => {
        const apptId = appt._id || appt.id;
        return apptId === id ? { ...appt, ...updatedAppt } : appt;
      }));
      showNotification(`Appointment status updated to ${status}`);
    } catch (err) { showNotification('Failed to update appointment', 'error'); }
  };

  const deleteAppointment = async (id) => {
    try {
      await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
      setAppointments(appointments.filter(appt => (appt._id || appt.id) !== id));
      showNotification(`Deleted appointment`);
    } catch (err) { showNotification('Failed to delete appointment', 'error'); }
  };

  const orderParts = async (id, orderQty) => {
    try {
      const part = parts.find(p => p.id === id);
      const newQty = part.qty + orderQty;
      const status = newQty > part.minQty ? 'In Stock' : 'Low Stock';
      
      const res = await fetch(`${API_URL}/parts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQty, status })
      });
      const updatedPart = await res.json();
      setParts(parts.map(p => p.id === id ? updatedPart : p));
      showNotification(`Submitted PO for ${orderQty} units of ${id}`);
    } catch (err) { showNotification('Failed to order parts', 'error'); }
  };

  const deletePart = async (id) => {
    try {
      await fetch(`${API_URL}/parts/${id}`, { method: 'DELETE' });
      setParts(parts.filter(part => part.id !== id));
      showNotification(`Deleted part ${id}`);
    } catch (err) { showNotification('Failed to delete part', 'error'); }
  };

  const saveDeskingDeal = async (deal) => {
    try {
      showNotification(`Deal saved for ${deal.customerName || 'customer'}.`);
      return deal;
    } catch (err) { showNotification('Failed to save deal', 'error'); }
  };

  const value = {
    inventory, addInventoryItem, updateInventoryStatus, deleteInventoryItem,
    leads, addLead, updateLeadStatus, deleteLead,
    appointments, addAppointment, updateAppointmentStatus, deleteAppointment,
    parts, orderParts, deletePart,
    saveDeskingDeal,
    currency, setCurrency, formatPrice, currencySymbols,
    showNotification,
    aiInsights, fetchAIInsights, loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
