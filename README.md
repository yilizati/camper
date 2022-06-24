# Camper

<img width="960" alt="screen shot" src="https://user-images.githubusercontent.com/82916717/175448764-537ca6e8-d430-44e7-a5db-0d538bf9a3e4.png">

Camper is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## https://goodcamps.herokuapp.com/

## Features
* Users can create, edit, and remove campgrounds
* Users can review campgrounds, and edit or remove their review
* Listed campgrounds are shown on MapBox

## Run it locally
1. Install mongodb
2. Create a cloudinary account to get an API key and secret code

```
git clone https://github.com/yilizati/goodcamps.git
cd yelpcamp
npm install
```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:
```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```
Run mongod in another terminal and node app.js in the terminal with the project.

Then go to localhost:3000
