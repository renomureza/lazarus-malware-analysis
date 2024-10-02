const Listing = require("../models/Listing");

exports.createListing = async (req, res) => {
  const { owner, tokenMint, price } = req.body;

  try {
    const listing = new Listing({
      owner,
      tokenMint,
      price,
      listedAt: new Date(),
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}