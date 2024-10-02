// src/models/Sizes.js

const mongoose = require('mongoose');

const SizesSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Sizes', SizesSchema);
