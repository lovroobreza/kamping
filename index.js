if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local');
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

//passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//sessions
const sessionConfig = {
    secret: 'secret101',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *2,
        maxAge: 1000 * 60 * 60 * 24 * 2
    }
}
app.use(session(sessionConfig))
app.use(flash())


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
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//paths
const campRoutes = require('./routes/campRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/', userRoutes)
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