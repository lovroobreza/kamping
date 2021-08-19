const express = require('express')
const router = express.Router({mergeParams:true})

const catchAsync = require('../utilities/CatchAsync')
const ExpressError = require('../utilities/ExpressError')

const Review = require('../models/Review')
const Campground = require('../models/Campground')

const { reviewSchema } = require('../schemas')

const { isLoggedIn } = require('../utilities/Middleware')

const validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isReviewUser = async(req,res,next) =>{
    const {id, reviewId} =req.params
    const review = await Review.findById(reviewId)
    if(!review.user.equals(req.user._id)){
        req.flash('error', 'you cant deleted other people reviews')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

router.post('/', validateReview, isLoggedIn, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.user = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'successfuly reviewed the camp')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn,  isReviewUser, catchAsync(async(req,res)=>{
    const {id, reviewId}= req.params
    await Campground.findByIdAndUpdate(id, {$pull: { reviews:reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfuly deleted your camp review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router