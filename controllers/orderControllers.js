const Order = require('../models/Order')
const Product = require('../models/product')
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions} = require("../utils");


const fakeStripeAPI = async ({amount, currency}) => {
  const client_secret = 'someRandomValue'
  return {client_secret, amount}
}

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
    image,
    product:_id,
   }
   //add item to order
    orderItems = [...orderItems,singleOrderItem]
    // calculate subtotal
    subtotal += item.amount * price;
  }
// calculate total
const total = tax + shippingFee + subtotal

// get client secret
const paymentIntent = await fakeStripeAPI({
  amount: total,currency: 'usd'
})


const order = await Order.create({
  orderItems,
  total,
  subtotal,
  tax,
  shippingFee,
  clientSecret: paymentIntent.client_secret,
  user: req.user.userId,
})

res
  .status(StatusCodes.CREATED)
  .json({order, clientSecret: order.client_secret})


};



const getAllOrders = async (req, res) => {
 const orders = await Order.find({})
 res.status(StatusCodes.OK).json({orders, count: orders.length})
}

// const getSingleOrder = async (req, res) => {
//    const { id: orderId } = req.params
//    const order = await Order.findOne({_id: orderId})
   
//    if (!order) {
//      throw
//    }

// }

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
  getAllOrders,
  getCurrentUserOrders,
  updateOrder,
};
