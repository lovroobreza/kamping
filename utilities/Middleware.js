const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error', 'Sorry but log in first')
    return res.redirect('/login')
}
    next()
}

module.exports = isLoggedIn