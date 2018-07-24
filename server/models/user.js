const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RecipeSchema = mongoose.Schema({
  dishType: String,
  name: String,
  ingredients: [],
  directions: [],
  upvotes: Number,
  downvotes: Number
});

const MealSchema = mongoose.Schema({
  title: String,
  description: String,
  recipes: [RecipeSchema]
});

const PartySchema = mongoose.Schema({
  title: String,
  date: Date,
  description: String,
  meals: [MealSchema],
});

const UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  parties: [PartySchema]
});

/** Compare the passed password with the value in the db.
* A model method
* @param {string} password
* @returns {object} callback
*/
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

/**
* The pre-save hook method
*/
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(hashError); }

    // replace a password string with has value
    user.password = hash;

    return next();
  });
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Party: mongoose.model('Party', PartySchema),
  Meal: mongoose.model('Meal', MealSchema),
  Recipe: mongoose.model('Recipe', RecipeSchema)
};
