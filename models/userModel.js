const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: [true, 'Please enter your first name'],
      minlength: 4
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email'],
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'Please Enter Valid Email']
    },
    location: {
      type: String,
      default: 'Egypt'
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm Your Password'],
      validate: {
        //this only works on create and save()
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same'
      }
    },
    favCities: [{
         cityName: { type: String, default: ''},
         cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
         degree: { type: String, default: ''}
        }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id'
});

userSchema.pre('save', async function(next) {
  //Only run if password was actually modified
  if (!this.isModified('password')) return next();

  //hash password to cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});


userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
