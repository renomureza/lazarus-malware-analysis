const User = require('../models/User');
const Collection = require("../models/Collection");
const jwt =  require('jsonwebtoken');


exports.getCollections = async (req,res)=>{

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const collections = await Collection.find({ designerId: decoded.id });
    res.status(200).json(collections);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


exports.createCollection = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { name, collectionAddress, imageUrl, jsonUrl } = req.body;

    // Log the request body and decoded token for debugging
    console.log('Request Body:', req.body);
    console.log('Decoded Token:', decoded);

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const collection = new Collection({
      name,
      collectionAddress,
      imageUrl,
      jsonUrl,
      designerId: decoded.id,
      designerUsername: user.username,
      products: []
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(400).json({ message: error.message });
  }
}

exports.updateCollection = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;
    const { name, collectionAddress, imageUrl, jsonUrl } = req.body;

    if (!name || !collectionAddress || !imageUrl || !jsonUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const collection = await Collection.findById(id);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    collection.name = name;
    collection.collectionAddress = collectionAddress;
    collection.imageUrl = imageUrl;
    collection.jsonUrl = jsonUrl;

    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.deleteCollection = async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;

    console.log('Decoded Token:', decoded); // Add logging
    const collection = await Collection.findById(id);
    if (!collection) {
      console.log('Collection not found'); // Add logging
      return res.status(404).json({ message: 'Collection not found' });
    }
    if (!collection.designerId.equals(decoded.id)) {
      console.log('Access denied'); // Add logging
      return res.status(403).json({ message: 'Access denied' });
    }

    await Collection.deleteOne({ _id: id }); // Change this line
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error); // Add logging
    res.status(400).json({ message: error.message });
  }
}

exports.getCollectionByAddress = async (req,res)=>{
  const { address } = req.params;
  try {
    const collection = await Collection.findOne({ collectionAddress: address });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getCollectionByCollectionAddress = async(req,res)=>{
  try {
    const { collectionAddress } = req.params;
    const collection = await Collection.findOne({ collectionAddress });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json(collection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getCollectionByDesignerId = async (req, res) => {
  try {
    const { designerId } = req.params;
    const collections = await Collection.find({ designerId }).select('name collectionAddress imageUrl jsonUrl');
    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections by designer:', error);
    res.status(400).json({ message: error.message });
  }
}

exports.getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Fetching collection with ID for public:', id); // Logging

    const collection = await Collection.findById(id);
    if (!collection) {
      console.log('Collection not found'); // Logging
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error); // Logging
    res.status(400).json({ message: error.message });
  }
}

