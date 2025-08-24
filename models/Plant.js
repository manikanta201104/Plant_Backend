const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  categories: { type: [String], required: true, minlength: 1 },
  availability: { type: Boolean, default: true },
  imageUrl: { type: String }, 
  description: { type: String },
}, { timestamps: true });

plantSchema.index({ name: 'text', categories: 'text' });

module.exports = mongoose.model('Plant', plantSchema);