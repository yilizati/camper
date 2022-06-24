const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./utils/schemaValidator')
const Campground = require('./models/campground')
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must sign in first.')
    return res.redirect('/login')
  }
  next()
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const foundCampground = await Campground.findById(id)
  if (!foundCampground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to update')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You are not review owner')
    return res.redirect(`/campgrounds/${reviewId}`)
  }
  next()
}


module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}
