const Lead = require('../models/Lead');
const { getAIInsights } = require('../services/geminiService');

exports.getLeads = async (req, res) => {
  try { res.json(await Lead.find({}).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addLead = async (req, res) => {
  try { 
    const newLead = await Lead.insert({ ...req.body, createdAt: new Date() });
    res.status(201).json(newLead); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateLead = async (req, res) => {
  try { 
    const updatedLead = await Lead.update({ id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true });
    res.json(updatedLead); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteLead = async (req, res) => {
  try { await Lead.remove({ id: req.params.id }, {}); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLeadInsights = async (req, res) => {
  try {
    const data = await Lead.find({});
    const insights = await getAIInsights('lead_scoring', data);
    res.json({ insights });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
