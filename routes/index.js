const express = require('express')
const router = express.Router();
const { ensureAuthenticated,ensureGuest} = require('../config/auth')

const Post = require('../models/Post')

// Welcome page 
router.get('/', ensureGuest,(req, res) => res.render('welcome') )

// Dashboard "user posts"
router.get('/dashboard', ensureAuthenticated,(req, res) => 
    
    res.render('dashboard',
    {
        name : req.user.name
    } ))

// Home "all posts"
router.get('/home', ensureAuthenticated, async(req, res) => {
    try {
        console.log(res.locals.user._id);
        const posts = await Post.find()
              .populate('user')
              .sort({createdAt :'desc'})
              .lean()
        res.render('home',{
          
          posts,
          
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      }
    })


module.exports = router;