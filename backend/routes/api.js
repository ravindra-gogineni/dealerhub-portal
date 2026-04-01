const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const leadController = require('../controllers/leadController');
const serviceController = require('../controllers/serviceController');

// Inventory Routes
router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.addInventory);
router.put('/inventory/:id', inventoryController.updateInventory);
router.delete('/inventory/:id', inventoryController.deleteInventory);
router.get('/inventory/insights', inventoryController.getInventoryInsights);

// Lead Routes
router.get('/leads', leadController.getLeads);
router.post('/leads', leadController.addLead);
router.put('/leads/:id', leadController.updateLead);
router.delete('/leads/:id', leadController.deleteLead);
router.get('/leads/insights', leadController.getLeadInsights);

// Appointment Routes
router.get('/appointments', serviceController.getAppointments);
router.post('/appointments', serviceController.addAppointment);
router.put('/appointments/:id', serviceController.updateAppointment);
router.delete('/appointments/:id', serviceController.deleteAppointment);

// Part Routes
router.get('/parts', serviceController.getParts);
router.post('/parts', serviceController.addPart);
router.put('/parts/:id', serviceController.updatePart);
router.delete('/parts/:id', serviceController.deletePart);

module.exports = router;
