// src/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  tokenMint: { type: String, required: true },
  price: { type: Number, required: true },
  listedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', ListingSchema);

