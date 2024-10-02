const Sizes = require("./../models/Sizes.js")

exports.addSize = async (req, res) => {
  const { productId, size, quantity } = req.body;

  if (!productId || !size || !quantity) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const newSize = new Sizes({ productId, size, quantity });
    await newSize.save();
    res.status(201).json(newSize);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    await Sizes.findByIdAndDelete(id);
    res.status(200).json({ message: 'Size deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateSize =  async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity is required and must be greater than 0' });
    }

    const size = await Sizes.findById(id);
    if (!size) {
      return res.status(404).json({ message: 'Size not found' });
    }

    size.quantity = quantity;

    await size.save();
    res.status(200).json(size);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}