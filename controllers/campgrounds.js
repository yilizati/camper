const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapbox_token = process.env.mapbox_token
const geocoder = mbxGeocoding({ accessToken: mapbox_token })

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user._id
    await newCampground.save()
    console.log(newCampground);
    req.flash('success', 'successfully made a campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const foundCampground =
        await Campground.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            }).populate('author')
    if (!foundCampground) {
        req.flash('error', 'No such campground exists.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { foundCampground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const foundCampground = await Campground.findById(id)
    if (!foundCampground) {
        req.flash('error', 'No campground found.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { foundCampground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
        console.log(campground)
    }
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}