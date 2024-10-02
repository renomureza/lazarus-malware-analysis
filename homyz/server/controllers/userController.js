const User = require("../models/User");
const Collection = require("../models/Collection")
const jwt =  require('jsonwebtoken');


exports.getUserInfo = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      solanaWallet: user.solanaWallet,
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

exports.updateUserInfo = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { email, solanaWallet } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { email, solanaWallet },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      solanaWallet: updatedUser.solanaWallet,
      userId: updatedUser._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

exports.getAllDesigners = async (req, res) => {
  try {
    const designers = await User.find({ role: 'designer' }).select('username email solanaWallet');
    res.status(200).json(designers);
  } catch (error) {
    console.error('Error fetching designers:', error);
    res.status(400).json({ message: error.message });
  }
}

exports.getDesignerByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const designer = await User.findOne({ username, role: 'designer' });
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getDesignerById = async (req, res) => {
  try {
    const { designerId } = req.params;
    const designer = await User.findById(designerId).select('username solanaWallet');
    if (!designer) return res.status(404).json({ message: 'Designer not found' });

    const collections = await Collection.find({ designerId }).select('name imageUrl');
    res.status(200).json({ ...designer.toObject(), collections });
  } catch (error) {
    console.error('Error fetching designer profile:', error);
    res.status(500).json({ message: 'router error' });
  }
}