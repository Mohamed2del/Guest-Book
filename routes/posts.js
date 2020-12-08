const express = require('express')
const router = express.Router()
const { ensureAuthenticated,ensureGuest} = require('../config/auth')

const Post = require('../models/Post')
const Comment = require('../models/Comment')
const { localsName } = require('ejs')
// @desc Show add post 
// @route GET / posts/add

router.get('/add',ensureAuthenticated ,(req,res)=>{
    res.render('add',{
      name : req.user.name

    })
})


// @desc  add post 
// @route Post / posts/add

router.post('/',ensureAuthenticated ,async (req,res)=>{
    
    req.body.user = req.user._id

    try {
        await Post.create(req.body)
        res.redirect('dashboard')
        
    } catch (err) {
        console.error(err)
        res.send('ops')
    }
})

// @desc  add post 
// @route Post / posts/add

router.post('/',ensureAuthenticated ,async (req,res)=>{
    
    req.body.user = req.user._id

    try {
        await Post.create(req.body)
        res.redirect('dashboard')
        
    } catch (err) {
        console.error(err)
        res.send('ops')
    }
})

// @desc Show edit page
// @route GET / stories/edit/:id

router.get('/edit/:id',ensureAuthenticated , async(req,res)=>{
    try {
      const post = await Post.findOne({
        _id : req.params.id
      }).lean()
      
      if(!post){
        return res.render('error/404')
      }
    
      if(post.user != req.user.id){
        res.redirect("/home")
      }else{
        res.render('edit',{put:true,
          post,
          name : req.user.name

        })
      }
    
    } catch (err) {
      console.log(err)
      return res.render('error/404')
    }
    
  })
  
// @desc  edit post 
// @route Post / posts/edit

router.put('/edit/:id',ensureAuthenticated ,async (req,res)=>{
    
    try {
        let post = await Post.findById(req.params.id).lean()
        if(!post){
          return res.render('/error/404')
        }
        if(post.user != req.user.id){
          res.redirect("/home")
        }else{
          post = await Post.findOneAndUpdate({_id:req.params.id} , req.body,{
            new : true,
            runValidators:true
          })
       

          res.redirect('/home')
        }
       } catch (err) {
         console.error(err)
         return res.render('error/500')
       }
      
    
})


// @desc  delete post 
// @route Delete / posts/edit

router.delete('/:id',ensureAuthenticated ,async (req,res)=>{
    
  try {
      let post = await Post.remove({_id :req.params.id})
      
      if(post.user != req.user.id){
        res.redirect("/home")
      }else{
        
     
        res.redirect('/home')
      }
     } catch (err) {
       console.error(err)
       return res.render('error/500')
     }
    
  
})


// @desc Show post-comment page
// @route GET / stories/:id

router.get('/:id',ensureAuthenticated , async(req,res)=>{
  try {
    const post = await Post.findOne({
      _id : req.params.id
    }).populate('user').lean()
    
    if(!post){
      return res.render('error/404')
    }
    else{
      const comments = await Comment.find({post : post._id}).populate('user').lean()
      res.render('post-comment',{put:true,
        post,comments,
        name :req.user.name
      })
    }
  
  } catch (err) {
    console.log(err)
    return res.render('error/404')
  }
  
})

// @desc  comment post 
// @route POST / posts/id

router.post('/:id',ensureAuthenticated ,async (req,res)=>{
    
  try {
      var post = await Post.findById(req.params.id).lean()
     

      if(!post){
        return res.render('/error/404')
      }
     else{
      const comment = new Comment({
        comment : req.body.comment,
        post : req.params.id,
        user : res.locals.user._id
      })
        await Comment.create(comment)
        
        res.redirect(`/posts/${req.params.id}`)
      }
     } catch (err) {
       console.error(err)
       return res.render('error/500')
     }
    
  
})

module.exports = router;