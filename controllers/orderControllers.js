
const createOrder = async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;

  if (!items || !totalAmount || !shippingAddress) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}   

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}   

const getSingleUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate('user', 'name email');

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}   

const getCurrentUserOrder = async (req, res) => {
  res.send('getCurrentUserOrder endpoint is not implemented yet.'); // Placeholder for future implementation
  
}
            

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Please provide a status to update.' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}   


module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  getSingleUserOrders,
  getCurrentUserOrder,
  updateOrder
};
