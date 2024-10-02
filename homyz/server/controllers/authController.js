const User =  require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt =  require('jsonwebtoken');


exports.loginUser =async (req,res)=>{
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        solanaWallet: user.solanaWallet,
        _id: user._id
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.registerUser = async(req,res)=>{
  const { username, password, email, solanaWallet } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword, email, solanaWallet, role: 'designer' });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
