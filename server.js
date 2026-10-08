const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const morgan = require('morgan')
const dotenv = require('dotenv')
const server = express()
const port = process.env.PORT || 3000

const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

dotenv.config()

// Passport config
require('./config/passport')

// EJS MIDDLEWARE
server.use(expressLayouts)

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL)
    console.log('Database Connected!!!')
  } catch (e) {
    console.log(e.stack)
  }
}

connectDB()

// Express Middleware
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs')
server.use(express.json())
server.use(express.static(__dirname + 'public')) //allows us to serve our static assets in public folder in root dir of out project
// BodyParser
server.use(express.urlencoded({ extended: false }))

// Express Session
server.use(
  session({
    secret: 'Ademide',
    resave: true,
    saveUninitialized: true,
  }),
)

// Passport Middleware
server.use(passport.initialize())
server.use(passport.session())

// Flash Middleware
server.use(flash())

// Morgan middleware
server.use(morgan('dev'))
// Global variables used in connecting Flash
server.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error')

  next()
})

// Routes
const indexRoute = require('./src/route/index.route')
const userRoute = require('./src/route/user.route')

server.use('/', indexRoute)
server.use('/users', userRoute)

server.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'Ok',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  })
})

server.listen(port, console.log(`The server is running on port ${port}`))
