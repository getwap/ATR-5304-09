const express = require('express');
const route = express.Router();
const AuthController = require('../controllers/AuthController');

route.use((req, res, next) => {
    var uemail = req.session.useremail;
    const allowUrls = ["/login", "/auth-validate", "/register", "/signup", "/forgotpassword", "/sendforgotpasswordlink", "/resetpassword", "/error", "/changepassword"];
    if (allowUrls.indexOf(req.path) !== -1) {
        if (uemail != null && uemail != undefined) {
            return res.redirect('/login');
        }
        
    } else if (!uemail) {
        //Disabling login page for now while we work on the dashboard
        //return res.redirect('/login');
    }
    next();
})


// Authentication
route.get('/login', (req, res, next) => {
    // console.log("Accessing the login page");
    res.render('auth/login', { page_title: 'Login', layout: 'layouts/layout-without-nav', 'message': req.flash('message'), error: req.flash('error') });
})

// validate login form
route.post('/auth-validate', AuthController.validate);

// logout
route.get('/logout', AuthController.logout);

route.get('/register', (req, res, next) => {
    res.render('auth/register', { page_title: 'Register', layout: 'layouts/layout-without-nav', message: req.flash('message'), error: req.flash('error') });
})

// validate register form
route.post("/signup", AuthController.signup);

route.get('/forgotpassword', (req, res, next) => {
    res.render('auth/forgotpassword', { page_title: 'Forgot password', layout: 'layouts/layout-without-nav', message: req.flash('message'), error: req.flash('error') });
})

// send forgot password link on user email
route.post("/sendforgotpasswordlink", AuthController.forgotpassword);

// reset password
route.get("/resetpassword", AuthController.resetpswdview);

// Change password
route.post("/changepassword", AuthController.changepassword);

route.get('/otherTemplates/auth-pass-change-basic', (req, res, next) => {
    res.render('otherTemplates/auth-pass-change-basic', { page_title: 'Change Password', layout: 'layouts/layout-without-nav' });
})

//500
route.get('/error', (req, res, next) => {
    res.render('auth/auth-404', { page_title: '404 Error', layout: 'layouts/layout-without-nav' });
})


module.exports = route;