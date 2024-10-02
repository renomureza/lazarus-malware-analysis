const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  tokenAddress: { type: String, required: true },
  walletAddress: { type: String, required: true },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NFT', NFTSchema);
