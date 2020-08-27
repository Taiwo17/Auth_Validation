const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const path = require('path')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const morgan = require('morgan')
const server = express()
const port = process.env.PORT || 3000;

// Passport config
require('./config/passport')

// EJS MIDDLEWARE
server.use(expressLayouts);

let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

mongoose.connect('mongodb://localhost/auth_validation', options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {       
  console.log("Connected to Database")
});

mongoose.Promise = global.Promise;

// Express Middleware
server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs')
server.use(express.json())
server.use(express.static(__dirname + "public")); //allows us to serve our static assets in public folder in root dir of out project
// BodyParser
server.use(express.urlencoded({extended: false}))

// Express Session
server.use(session({
  secret: 'Ademide',
  resave: true,
  saveUninitialized: true,
}))

// Passport Middleware
server.use(passport.initialize());
server.use(passport.session());

// Flash Middleware
server.use(flash());

// Morgan middleware
server.use(morgan('dev'))
// Global variables used in connecting Flash
server.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error')

  next();
})

// Routes 
const indexRoute =   require('./src/route/index.route');
const userRoute = require('./src/route/user.route')

server.use('/', indexRoute);
server.use('/users', userRoute);

server.listen(port, console.log(`The server is running on port ${port}`))