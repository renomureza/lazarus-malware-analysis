const jwt =  require('jsonwebtoken');
const NFT = require("../models/NFT");

exports.createNFT = async (req, res) => {
  const { tokenAddress, walletAddress } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const designerId = decoded.id;

      if (!tokenAddress || !walletAddress) {
          return res.status(400).json({ success: false, message: 'Token address and wallet address are required.' });
      }

      const nft = new NFT({ tokenAddress, walletAddress, designerId });
      await nft.save();
      res.status(201).json({ success: true, nft });
  } catch (error) {
      console.error('Error saving NFT:', error);
      res.status(500).json({ success: false, message: 'Failed to save NFT.', error });
  }
}

exports.getAllNFTs =async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const designerId = decoded.id;

      const nfts = await NFT.find({ designerId });
      res.status(200).json(nfts);
  } catch (error) {
      console.error('Error fetching NFTs:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch NFTs.', error });
  }
}
