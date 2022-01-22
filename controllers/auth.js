const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
});

router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup'
    });
});

router.post('/login', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password.')
                return res.redirect('/login')
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/journal');
                        });
                    }
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err));
});

router.post('/signup', (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    //TODO: add validation
    User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                //TODO: Change to error message? 
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        fname: fname,
                        lname: lname,
                        email: email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
});

module.exports = router;