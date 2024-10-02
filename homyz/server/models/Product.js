const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productAddress: { type: String, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  color: [{ type: String, required: true }], 
  description: { type: String },
  price: { type: Number, required: true },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  collectionAddress: { type: String, required: true },
  imageUrl1: { type: String, required: true },
  imageUrl2: { type: String },
  imageUrl3: { type: String },
  imageUrl4: { type: String },
  imageUrl5: { type: String },
  jsonUrl: { type: String },
  listed: { type: Boolean, default: false },
});

ProductSchema.pre('remove', async function (next) {
  try {
    // Find the collection that this product belongs to
    const collection = await Collection.findById(this.collectionId);
    if (collection) {
      // Remove the product ID from the products array in the collection
      collection.products.pull(this._id);
      await collection.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', ProductSchema);
