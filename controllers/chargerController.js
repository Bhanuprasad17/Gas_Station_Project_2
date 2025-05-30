const ChargingStation = require('../models/ChargingStation');

// Create
exports.createCharger = async (req, res) => {
  try {
    const charger = new ChargingStation(req.body);
    const saved = await charger.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read with optional filters
exports.getChargers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.powerOutput) filters.powerOutput = Number(req.query.powerOutput);

    const chargers = await ChargingStation.find(filters);
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateCharger = async (req, res) => {
  try {
    const updated = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteCharger = async (req, res) => {
  try {
    const deleted = await ChargingStation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
