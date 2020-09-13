const mongoose = require('mongoose')
const StorySchema = new mongoose.Schema({
    
    post:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post',StorySchema)