const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const morgan = require('morgan')
const moment = require('moment')
const helpers = require('./helpers/ejs')
// routes require
const index =require('./routes/index')
const users = require('./routes/users')
const posts = require('./routes/posts')
const app = express()

// passport config
require('./config/passport')(passport)
//DB Config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true}).then(console.log('Mongodb connected ...')).catch(err=> console.log(err))
// EJS
app.use(expressLayout);
app.set('view engine' , 'ejs')

// Bodyparser 
app.use(express.urlencoded({extended:false}))

// method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

app.locals.dateFormat = helpers.dateFormat
app.locals.editButtton = helpers.editButtton
// Express Session 
app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      store : new MongoStore({mongooseConnection:mongoose.connection})

    })
  );


// Passport middelware 
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash())

// Global vars
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null

    next()

})
// Routes
app.use('/', index )
app.use('/users' , users)   
app.use('/posts',posts)

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server Started on port ${PORT}`))