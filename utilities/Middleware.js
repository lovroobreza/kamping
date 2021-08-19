const { campgroundSchema } = require('../schemas')
const ExpressError = require('./ExpressError')
const Campground = require('../models/Campground')

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error', 'Sorry but log in first')
    return res.redirect('/login')
}
    next()
}

module.exports.validateCampground =(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(err => err.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isUser = async(req,res,next) =>{
    const {id}= req.params
    const campground = await Campground.findById(id)

    if (!campground.user[0].equals(req.user._id) ){
        req.flash('error', 'You cant change something that isnt yours')
        return res.redirect(`/campgrounds`)        
    }
    next()
}
