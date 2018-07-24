const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5000;

// configure app to use BodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow CORS and Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.use(passport.initialize());

const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/access', authCheckMiddleware);

const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening precious');
  next();  // this line allows us to move onto next route and not stop here
});

//  accessed at GET http://localhost:8080/API
router.get('/welcome', (req, res) => {
  res.send({ express: 'hooray! welcome to our api!' });
});


//***********************NEW ROUTE FOR EXTERNAL API**************************
router.route('/recipes/:recipeSearch')

  .get(function(req, res) {
    let url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?addRecipeInformation=true&fillIngredients=false&instructionsRequired=true&limitLicense=false&number=8&offset=0&query=' + req.params.recipeSearch;
    req.pipe(request(url)).pipe(res);
  });

// Register Our Routes ------------------
// all of our routes will be prefixed with /api
const apiRoutes = require('./server/routes/api');

app.use('/api', router);
app.use('/access', apiRoutes);



app.listen(port, () => console.log(`Listening on port ${port}`));
