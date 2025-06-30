const { required } = require('joi')
const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'please provide rating'],
    },
   title: {
    type: String,
    trim: true,
    required: [true, 'please provide review title']
   },
   comment: {
    type: String,
    required: [true, 'please provide review text'],
   },
   user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
   },
   product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
   },
},
   {timestamps: true}

)

ReviewSchema.index({product: 1, user: 1}, {unique: true})

ReviewSchema.post('save', async function () {
    console.log('post save hook called');
})

ReviewSchema.post('remove', async function () {
    console.log('post remove hook  called');
    
})


module.exports = mongoose.model('Review', ReviewSchema)
