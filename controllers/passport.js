const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const localStrategy = require("passport-local").Strategy;

module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'email',passwordField:'psw'},(email,password,done)=>{
        //match user
        //match email
        User.findOne({email:email}).then((user)=>{
            if(!user){
                return done(null,false,{message:'That email is not registered'})
            }
            //match password
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){
                    throw err
                }
                if (isMatch) {
                    return done(null,user)
                }else{
                    return done(null,false,{message:'password is incorrect'})
                }
            })
        })
    }))
        //serializeUser to store user in session after login successful
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        }); 
    
        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
}
