const mongoose = require('mongoose')
const Cities = require('./cities')
const { descriptors, places } = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => console.log('CONNECTION OPENED'))

const sample = array => array[Math.floor(Math.random() * array.length)]

Campground.deleteMany().exec()

const seedDB = async () => {
    for (let i = 0; i <= 7; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '621bb7b40646aa454ea36d2d',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium maxime doloribus, blanditiis explicabo, quaerat iste voluptatem tempore iusto eligendi quae necessitatibus atque nobis veniam asperiores dolorem culpa earum quibusdam illum.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    Cities[random1000].longitude,
                    Cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/cyramstorage/image/upload/v1646713661/YelpCamp/famoq3jrh8gzgrzp4kff.png',
                    filename: 'YelpCamp/famoq3jrh8gzgrzp4kff',
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => console.log('CONNECTION CLOSED'))



