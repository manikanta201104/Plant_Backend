const express = require('express');
const Joi = require('joi');
const Plant = require('../models/Plant');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
    }
  },
});

const plantSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  availability: Joi.boolean().required(),
  imageUrl: Joi.string().optional(),
  description: Joi.string().optional(),
});

router.get('/plants', async (req, res, next) => {
  try {
    const { search, categories } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search, $caseSensitive: false };
    }

    if (categories) {
      const catArray = categories.split(',');
      query.categories = { $in: catArray };
    }

    const plants = await Plant.find(query).sort({ name: 1 }).limit(50);
    res.json(plants);
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Plant.distinct('categories');
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post('/plants', upload.single('image'), async (req, res, next) => {
  const data = {
    ...req.body,
    categories: Array.isArray(req.body.categories) ? req.body.categories : JSON.parse(req.body.categories || '[]'),
    availability: req.body.availability === 'true' || req.body.availability === true,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
  };

  const { error } = plantSchema.validate(data);
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  try {
    const plant = new Plant(data);
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Plant name already exists' });
    next(err);
  }
});

router.put('/plants/:id', upload.single('image'), async (req, res, next) => {
  const data = {
    ...req.body,
    categories: Array.isArray(req.body.categories) ? req.body.categories : JSON.parse(req.body.categories || '[]'),
    availability: req.body.availability === 'true' || req.body.availability === true,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
  };

  const { error } = plantSchema.validate(data);
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Plant name already exists' });
    next(err);
  }
});

router.delete('/plants/:id', async (req, res, next) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;