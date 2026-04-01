const Appointment = require('../models/Appointment');
const Part = require('../models/Part');

// Appointment Handlers
exports.getAppointments = async (req, res) => {
  try { res.json(await Appointment.find({}).sort({ time: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addAppointment = async (req, res) => {
  try { 
    const newAppt = await Appointment.insert({ ...req.body, createdAt: new Date() });
    res.status(201).json(newAppt); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateAppointment = async (req, res) => {
  try { 
    const updatedAppt = await Appointment.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true });
    res.json(updatedAppt); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteAppointment = async (req, res) => {
  try { await Appointment.remove({ _id: req.params.id }, {}); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Part Handlers
exports.getParts = async (req, res) => {
  try { res.json(await Part.find({}).sort({ name: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addPart = async (req, res) => {
  try { 
    const newPart = await Part.insert({ ...req.body, createdAt: new Date() });
    res.status(201).json(newPart); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updatePart = async (req, res) => {
  try { 
    const updatedPart = await Part.update({ id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true });
    res.json(updatedPart); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deletePart = async (req, res) => {
  try { await Part.remove({ id: req.params.id }, {}); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
