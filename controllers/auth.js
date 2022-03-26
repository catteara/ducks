const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {
    check,
    validationResult
} = require('express-validator')
const user = require('../models/user')


router.get('/login', (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: ""
        }
    });
});

router.get('/signup', (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            fname: "",
            lname: "",
            email: "",
            password: ""
        }
    });
});

router.post('/login', check('email').isEmail().withMessage('Please enter a valid email'), (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email
            }
        });
    }
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email.')
                return res.redirect('/login')
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                        });
                    }
                    return res.render('auth/login', {
                        pageTitle: 'Login',
                        errorMessage: 'Invalid Password',
                        oldInput: {
                            email: email
                        }
                    });
                })
                .catch(err => {
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err));
});

router.post('/signup',
    [check('email').isEmail().withMessage('Please enter a valid email').custom((value, {
            req
        }) => {
            return User.findOne({
                    email: value
                })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email is already in use, please choose a different one')
                    }
                })
        }),
        check('password').isLength({
            min: 8
        }).withMessage('Please use a password with at least 8 characters'),
        check('confirmPassword').custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match')
            }
            return true
        }),
    ],
    (req, res, next) => {
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const password = req.body.password;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render('auth/signup', {
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: password
                }
            });
        }
        bcrypt
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
            })
            .catch(err => {
                console.log(err);
            })
    });

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
});

module.exports = router;