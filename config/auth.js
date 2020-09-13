module.exports = {
    ensureAuthenticated : function(req,res,next){
        if (req.isAuthenticated()){
            next()
        }
        else{
            req.flash('error_msg','please log in to view this resource')
            res.redirect('/users/login')
        }
    },

    ensureGuest: function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
}}