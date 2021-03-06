const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const catchAsync = require('../utilities/CatchAsync')

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync( async(req,res)=>{
    try{
        const{ email,username,password } = req.body
        const user = new User({email,username})
        const registeredUser = await User.register(user,password)
        req.login(registeredUser, err =>{
            if(err){
                return next(err)
            } else {
                req.flash('success', 'Welcome to campsitez')
                res.redirect('/campgrounds')    
            } 
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }   
}))

router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
    console.log(currentUser)
})

router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success', 'Come back soon!')
    res.redirect('/campgrounds')
})

module.exports = router