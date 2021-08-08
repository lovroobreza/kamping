const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localPassport = require('passport-local')
const User = require('./models/User')

//need for ejs
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//midleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(flash())

//sessions
const sessionConfig ={
    secret: 'loool',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        //1 week expire
        expires: Date.now() + (1000*60*60*24*7),
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//mongoose
mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTypology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open',  () => { 
    console.log('Database connected')
})

//express error 
const ExpressError = require('./utilities/ExpressError')
 
//flash
app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//paths
const campRoutes = require('./routes/campRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
app.use('/campgrounds', campRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err
    if(!err.message) err.message = 'Oh no something went wrong'
    res.status(statusCode).render('error', { err })
})

//port
app.listen(3000,()=>{
    console.log('listening on port 3k')
})