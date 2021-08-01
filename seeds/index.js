// USED FOR SEEDING AT THE START
//mongoose
const mongoose = require('mongoose')

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

//models
const Campground = require('../models/Campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

//name for campgrounds
const sample = (array) => array[Math.floor(Math.random() * array.length)]

//seed the database
const seedDb = async() =>{
    await Campground.deleteMany({})
    for(let i = 0; i<50; i++){
        const randomCity = Math.floor(Math.random()*1000)

        const c = new Campground({
            location:`${cities[randomCity].city}, ${cities[randomCity].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })

        await c.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})