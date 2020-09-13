const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

// User model
const User = require('../models/User')

// Login 
router.get('/login', (req, res) => res.render('login') )


// Register
router.get('/register', (req, res) => res.render('register') )


// Register Handle 
router.post('/register' , (req,res) =>{
    console.log(req.body)
    const {name , email , password , password2} = req.body;
    let errors = [];

    // Check required fields 
    if (!name || !email || !password || !password2){
        errors.push({msg : 'Please fill in all fields'})
    }

    // check passwords match

    if (password !== password2){
        errors.push({msg:'Passwords do not match'})
    }

    // Check pass length 
    if (password.length < 6){
        errors.push({msg :'password should be at least 6 characters'})
    }

    if (errors.length > 0){
        console.log(errors)
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
            
        })
    }
    else{
        // Validation passed

        User.findOne({email : email})
        .then(user =>{
            if (user){
                //User exist
                errors.push({msg : "Email is allready registred"})
                res.render('register' , {
                    errors,
                    name,
                    email,
                    password,
                    password2
                    
                })
            }else {
                const newUser = new User ({
                    name,
                    email,
                    password
                });
                // Hash Password 
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if ( err) throw err
                    //set password to hashed
                    newUser.password = hash;
                    // saver user 
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg',"You are now registred and can log in");
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
                }))
            }
        })
        .catch()

    }
})


// login handle 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
module.exports = router;