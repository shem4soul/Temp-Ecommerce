const Product = require('../models/product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path') 

const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count: products.length})
 
}
    const getSingleProduct = async (req, res) => {
        const {id: productId} = req.params
        const product = await Product.findOne({_id: productId}).populate('reviews')

         if (!product) {
            throw new CustomError.NotFoundError(`No product with id: ${productId}`)
         }
         res.status(StatusCodes.OK).json({ product });
    }

const updateProduct = async (req, res) => {
    const {id: productId } = req.params
    const product = await Product.findByIdAndUpdate({_id: productId}, req.body,{
      new: true,
      runValidators: true,
    })

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`)
     }
     res.status(StatusCodes.OK).json({ product });
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  // ✅ Ensure you get a full Mongoose document
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  // ✅ This will trigger pre('remove') to delete related reviews
  await product.deleteOne(); // Use deleteOne instead of remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed' });
};



// const deleteProduct = async (req, res) => {
//   const { id: productId } = req.params;
//   const product = await Product.findById(productId); 

//   if (!product) {
//     throw new CustomError.NotFoundError(`No product with id: ${productId}`);
//   }
//   await product.remove();
//   res.status(StatusCodes.OK).json({ msg: "Sucess! Product removed" });
// }


const uploadImage = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError('No file uploaded');
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please upload an image file');
  }

  const maxSize = 1 * 1024 * 1024; // 1MB
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError('Please upload an image smaller than 1MB');
  }

  const imageName = `${Date.now()}-${productImage.name}`;
  const imagePath = path.join(__dirname, '../public/uploads/', imageName);

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${imageName}` });
};


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};  