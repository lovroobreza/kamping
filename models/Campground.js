const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./Review')
const User = require('./User')

const CampgroundSchema = new Schema({
    title:String,
    price: Number,
    image:String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    user:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.remove({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)