const Inventory = require('../models/Inventory');
const { getAIInsights } = require('../services/geminiService');

exports.getInventory = async (req, res) => {
  try { res.json(await Inventory.find({}).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addInventory = async (req, res) => {
  try { 
    const newItem = await Inventory.insert({ ...req.body, createdAt: new Date() });
    res.status(201).json(newItem); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateInventory = async (req, res) => {
  try { 
    const updatedItem = await Inventory.update({ id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true });
    res.json(updatedItem); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteInventory = async (req, res) => {
  try { await Inventory.remove({ id: req.params.id }, {}); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getInventoryInsights = async (req, res) => {
  try {
    const data = await Inventory.find({});
    const insights = await getAIInsights('inventory_optimization', data);
    res.json({ insights });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
