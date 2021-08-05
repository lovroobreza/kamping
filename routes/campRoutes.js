const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/CatchAsync')
const { campgroundSchema } = require('../schemas')
const Campground = require('../models/Campground')
const ExpressError = require('../utilities/ExpressError')

const validateCampground =(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.post('/', validateCampground, catchAsync(async(req, res, next)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'successfuly made new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/new', (req,res)=>{
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'The camp is missing, it might have gotten deleted')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'The camp is missing and you cant edit something that isnt there :)')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req,res)=>{
    const {id}= req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'successfuly updated your campground')
    res.redirect(`/${campground._id}`)
}))

router.delete('/:id', catchAsync(async(req,res)=>{
    const {id}= req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router