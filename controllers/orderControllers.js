const Order = require('../models/Review')
const Product = require('../models/product')
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions} = require("../utils");


// const createOrder = async (req, res) => {
//   const {items:cartItems, tax, shippingFee} = req.body

//   if (!items || items.length < 1) {
//     throw new CustomError.BadRequestError('No cart items provided')
//   }
//   if (!tax || !shippingFee) {
//     throw new CustomError.BadRequestError(
//       'Please provide tax and shipping fee'
//     )
//   }

//   let orderItems = []
//   let subtotal = 0

//   for (const item of cartItems) {
//     const dbProduct = await Product.findOne({_id: item.product})
//     if (!dbProduct) { 
//       throw new CustomError.NotFoundError(
//         `No product with id : ${item.product}`
//       )
//     }
//     const {name, price , image, _id } = dbProduct
//     console.log(name, price, image)
//   }

//   res.send('create order')

// };


const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('Please provide tax and shipping fee');
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id: ${item.product}`);
    }

    const { name, price, image, _id } = dbProduct;
   const singleOrderItem = {
    amount: item.amount,
    name,
    price,
    product:_id,
   }
   //add item to order
    orderItems = [...orderItems,singleOrderItem]
    // calculate subtotal
    subtotal += item.amount * price;
  }
console.log(orderItems);
console.log(subtotal);
  res.send('create order');
};


const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate(
      "user",
      "name email"
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCurrentUserOrders = async (req, res) => {
  res.send("getCurrentUserOrder endpoint is not implemented yet."); // Placeholder for future implementation
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ message: "Please provide a status to update." });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
