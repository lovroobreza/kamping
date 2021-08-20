const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/CatchAsync')
const Campground = require('../models/Campground')
const multer = require('multer')
const {storage} =require('../cloudinary')
const upload = multer({storage})

const {isLoggedIn, isUser, validateCampground} = require('../utilities/Middleware')

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(async(req, res, next)=>{
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map( f =>({ url: f.path, filename:f.filename }))
    campground.user = req.user._id
    await campground.save()
    req.flash('success', 'successfuly made new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews', 
        populate:{ path: 'user'}}).populate('user')
    
    if(!campground){
        req.flash('error', 'The camp is missing, it might have gotten deleted')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })

}))

router.put('/:id', validateCampground, isLoggedIn, isUser, catchAsync(async (req,res)=>{
    const {id}= req.params
    
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'successfuly updated your campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:id', isLoggedIn, isUser, catchAsync(async(req,res)=>{
    const {id}= req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'You deleted your campground :(')
    res.redirect('/campgrounds')
}))

router.get('/:id/edit', isLoggedIn, isUser, catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'The camp is missing and you cant edit something that isnt there :)')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))


module.exports = router