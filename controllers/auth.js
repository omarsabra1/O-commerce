const User = require('../models/user');
const bcrypt=require('bcrypt');
const e = require("express");
exports.getLogin = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }else{
        message=null;
    }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message
  });
};

exports.getSignup = (req, res, next) => {
    let message=req.flash('error');
    if(message.length>0){
        message=message[0];
    }else{
        message=null;
    }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message
  });
};

exports.postLogin = (req, res, next) => {
   const email=req.body.email;
  const  password=req.body.password;
 User.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('error','Invalid Email or Password ');
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password)
            .then(match=>{
                if(match){
                    req.session.isLoggedIn=true;
                    req.session.user=user;
                    return req.session.save(error => {
                        console.log(error);
                        res.redirect('/');
                    })
                }
                req.flash('error','Invalid Email or Password ');
                res.redirect('/login');
            }).catch(err=>console.log(err));
    }).catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email=req.body.email;
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword;
  User.findOne({email:email})
      .then(userDoc=> {
          if (userDoc) {
              req.flash('error','E-Mail is already exists ,please pick another E-Mail');
              return res.redirect('/signup');
          }f
          return bcrypt.hash(password, 12)
              .then(hashpass=>{
              const user = new User({
                  email : email,
                  password  :hashpass,
                  cart : {items : [] }
              });
              return user.save();
          });
      })
      .then(result=>{
        return res.redirect('/login');
  }).catch(err=>console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};