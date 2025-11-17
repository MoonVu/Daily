import express from 'express';
import Workshop from '../models/Workshop.js';

const router = express.Router();

// GET all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ name: 1 });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new workshop
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tên xưởng không được để trống' });
    }

    // Check if workshop already exists
    const existingWorkshop = await Workshop.findOne({ name: name.trim() });
    if (existingWorkshop) {
      return res.status(400).json({ error: 'Xưởng này đã tồn tại' });
    }

    const workshop = new Workshop({ name: name.trim() });
    await workshop.save();
    res.status(201).json(workshop);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Xưởng này đã tồn tại' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;

