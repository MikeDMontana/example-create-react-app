const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const UserSchema = require('../models/user');
const PartySchema = require( '../models/user');
const MealSchema = require('../models/user');

mongoose.connect('mongodb://MikeDMontana:Mi55oula123@ds225010.mlab.com:25010/foodies-plan-it-v2', {useNewUrlParser: true });

// define all Mongoose models
const User = UserSchema.User;
const Party = UserSchema.Party;
const Meal = PartySchema.Meal;
const Recipe = MealSchema.Recipe;

const router = express.Router();

//********************NEW ROUTE FOR USERs**************************
router.route('/user')

  .get(function(req, res) {
    User.find(function(err, user) {
      if (err)
        res.send(err);

        res.json(user);
    });
  });

//*********************BEGIN Routes for Parties***********************
router.route('/user/:user_id/parties')

//==============create a new party at POST http://localhost:8080/api/parties
  .post(function(req, res) {
    let party = new Party({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
    });

    // save the party and check for errors
    party.save(function(err) {
      if (err)
        res.send(err);

        res.json({ message: 'party created!' });
    });
  })


//===================GET specific party http://localhost:8080/api/parties/:party_id
router.route('/user/:user_id/parties/:party_id')

    .get(function(req, res) {
      Party.findById(req.params.party_id, function(err, party) {
        if (err)
          res.send(err);

          res.json(party);
      });
    })

    //=========================UPDATE specific party http://localhost:8080/api/parties/:party_id
    .put(function(req, res) {

      //use our party model find the party we want
      Party.findById(req.params.party_id, function(err, party) {
        if (err)
          res.send(err);

          let meal = new Meal({
            title: req.body.title,
            description: req.body.description
          });

          party.meals.push(meal);

          party.save(function(err) {
            if (err)
              res.send(err);

              res.json(party.meals);
          });
        });
      })

      //===============DELETE specific party http://localhost:8080/api/parties/:party_id
      .delete(function(req, res) {
        party.remove({
          _id: req.params.party_id
        }, function(err, user) {
          if (err)
            res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
      });

      //===============================GET specific meal within party http://localhost:8080/api/parties/:party_id/meals/:meal_id
      router.route('/user/:user_id/parties/:party_id/meals/:meal_id')

        .get(function(req, res) {
          Party.findById(req.params.party_id, function(err, party) {
            if (err)
              res.send(err);

              res.json(party.meals.id(req.params.meal_id));
          });
        })

        //=============================UPDATE specific meal at http://localhost:8080/api/parties/:party_id/meals/:meal_id
        //=============================a new recipe object is defined through user input and pushed to meal
        .put(function(req, res) {

          // use our party model to find the party we want
          Party.findById(req.params.party_id, function(err, party) {
            if (err)
              res.send(err);

              let recipe = new Recipe({
                name: req.body.name,
                directions: req.body.directions,
                ingredients: req.body.ingredients,
                upvotes: req.body.upvotes,
                downvotes: req.body.downvotes,
                dishType: req.body.dishType
              });

              party.meals.id(req.params.meal_id).recipes.push(recipe);
              party.save(function(err) {
                if (err)
                  res.send(err);

                  res.json({ message: 'party updated!' });
              });
            });
          });

          //===========================GET all recipes within meal at http://localhost:8080/api/parties/:party_id/meals/:meal_id/recipes
          router.route('/user/:user_id/parties/:party_id/meals/:meal_id/recipes/:recipe_id')
            .get(function(req, res) {
              Party.findById(req.params.party_id, function(err, party) {
                if (err)
                  res.send(err);

                  res.json(party.meals.id(req.params.meal_id).recipes);
              });
            });

            //=========================GET specific recipe within meal at http://localhost:8080/api/parties/:party_id/meals/:meal_id/recipes/:recipe_id
            router.route('/user/:user_id/parties/:party_id/meals/:meal_id/recipes/:recipe_id')
              .get(function(req, res) {
                Party.findById(req.params.party_id, function(err, party) {
                  if (err)
                    res.send(err);

                    res.json(party.meals.id(req.params.meal_id).recipes.id(req.params.recipe_id));
                });
              })

              //=========================update recipe votes up or down at http://localhost:8080/api/parties/:party_id/meals/:meal_id/recipes/:recipe_id
                .put(function(req, res) {
                  Party.findById(req.params.party_id, function(err, party) {
                    if (err)
                      res.send(err)

                      party.meals.id(req.params.meal_id).recipes.id(req.params.recipe_id).upvotes += parseInt(req.body.upvotes);
                      party.meals.id(req.params.meal_id).recipes.id(req.params.recipe_id).downvotes += parseInt(req.body.downvotes);

                      party.save(function(err) {
                        if (err)
                          res.send(err);

                          res.json({ message: 'party updated!' });
                      });
                    });
                  });


  module.exports = router;
