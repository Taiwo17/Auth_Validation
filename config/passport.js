/* const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Load User model
const User = require('../src/model/user.model');

// Middleware
passport.use(new LocalStrategy(User.authenticate()))

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return done(null, false, {message: `Email isn't registered`})
                }

                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password Incorrect'})
                    }
                })
            })
            .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      })();
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    })();
}; */

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../src/model/user.model')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return done(null, false, {
            message: 'Email not registered',
          })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
          return done(null, false, {
            message: 'Incorrect password',
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
