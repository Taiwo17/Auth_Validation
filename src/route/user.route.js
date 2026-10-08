const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

// User Model
const User = require('../model/user.model')

// ===============================
// Login Page
// ===============================
router.get('/login', (req, res) => {
  res.render('login')
})

// ===============================
// Dashboard Page
// ===============================

router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login')
  }

  res.render('dashboard', {
    user: req.user,
  })
})

// ===============================
// Logout Page
// ===============================

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }

    req.flash('success_message', 'You have been logged out successfully.')

    req.session.destroy((err) => {
      if (err) {
        return next(err)
      }

      res.redirect('/users/login')
    })
  })
})

// ===============================
// Register Page
// ===============================
router.get('/register', (req, res) => {
  res.render('register')
})

// ===============================
// Register Handle
// ===============================
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body

  let errors = []

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      message: 'Please input all required fields',
    })
  }

  // Check password match
  if (password !== password2) {
    errors.push({
      message: 'Passwords do not match',
    })
  }

  // Check password length
  if (password && password.length < 6) {
    errors.push({
      message: 'Password should be at least 6 characters',
    })
  }

  // If validation fails
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
    })
  }

  try {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    })

    if (existingUser) {
      return res.render('register', {
        errors: [
          {
            message: 'Email already registered',
          },
        ],
        name,
        email,
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    })

    // Save user to MongoDB
    await newUser.save()

    // Success message
    req.flash(
      'success_message',
      'You are now a registered member. You can now login.',
    )

    return res.redirect('/users/login')
  } catch (err) {
    console.error('Registration error:', err)

    return res.render('register', {
      errors: [
        {
          message: 'Something went wrong during registration',
        },
      ],
      name,
      email,
    })
  }
})

// ===============================
// Login Handle
// ===============================
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

module.exports = router
