const express = require('express')
const router = express.Router();
const { ensureAuthenticated,ensureGuest} = require('../config/auth')

const Post = require('../models/Post')

// Welcome page 
router.get('/', ensureGuest,(req, res) => res.render('welcome') )

// Dashboard "user posts"
router.get('/dashboard', ensureAuthenticated,async(req, res) => {
  const posts = await Post.find({user:req.user._id})
              .populate('user')
              .sort({createdAt :'desc'})
              .lean()
  res.render('dashboard',
  {
      name : req.user.name,
      posts,
      delete : true
      
      
  } )
})
    
    
// Home "all posts"
router.get('/home', ensureAuthenticated, async(req, res) => {
    try {
        const posts = await Post.find()
              .populate('user')
              .sort({createdAt :'desc'})
              .lean()
        res.render('home',{
          
          posts,
          name : req.user.name,
          user : req.user
          
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      }
    })


module.exports = router;
