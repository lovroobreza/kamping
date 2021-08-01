const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const path = require('path')

//need for ejs
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//midleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(methodOverride('_method'))

//mongoose
mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTypology:true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open',  () => { 
    console.log('Database connected')
})

//mongoose model
const Campground = require('./models/Campground')

//paths
app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds', async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

app.post('/campgrounds', async(req,res)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req,res)=>{
    const {id}= req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async(req,res)=>{
    const {id}= req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

//port
app.listen(3000,()=>{
    console.log('listening on port 3k')
})