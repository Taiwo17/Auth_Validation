const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const  router = express.Router()

// Passport file
// const configPass = require('/config/passport')

// User Model
const User = require('../model/user.model')

// Login Page
router.get('/login', (req, res) => res.render('login'))


// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res) => {
    // Destructing: Collecting the data from the body
    const { name, email, password, password2 } = req.body

    // Validation
    let errors = [];
    // Check required filed
    if (!name || !email || !password, !password2){
        errors.push({ message: "Please input all required field" })
    }

    // Check Password match
    if (password !== password2) {
        errors.push({message: "Password do not match"})
    }

    // Password length
    if (password.length < 6){
        errors.push({ message: 'Password should be at least 6 Characters'})
    }

    // Checking the overall form
    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        User.findOne({ email: email}).then(user => {
            if (user){
                // User Exist
                errors.push({message: 'Email already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // Hash Password: Generate a salt
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Set Password to hash
                    newUser.password = hash;
                    // Save new User
                    newUser.save()
                    .then(user => {
                        req.flash('success_message', 'You are now a registered member. You can now  login ')
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }));
            }
        });
    }
});

// Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router;