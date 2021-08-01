const express = require('express')
const app = express()
const mongoose = require('mongoose')

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


//need for ejs
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//paths
app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds', async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})


app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})
//port
app.listen(3000,()=>{
    console.log('listening on port 3k')
})