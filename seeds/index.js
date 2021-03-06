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
        const price = Math.floor(Math.random()*50)
        const c = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location:`${cities[randomCity].city}, ${cities[randomCity].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like A',
            price,
            user: "6118279e712549081c7b0d85"
        })

        await c.save()
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})

// user id - "6118279e712549081c7b0d85"