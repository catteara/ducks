const express = require('express');
const router = express.Router();
const Contact = require('../models/contact')
const { name, email, subject, message } = require('process');

router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home'
    })
})

router.get('/contact', (req, res) => {
    res.render('contact', {
        pageTitle: 'Contact Me',
        contact: new Contact()
    })
})

router.post('/contact', async (req, res) => {
    req.contact = new Contact({
        name: name,
        email: email,
        subject: subject,
        message: message
    })
    let contact = req.contact
        contact.name = req.body.name
        contact.email = req.body.email
        contact.subject = req.body.subject
        contact.message = req.body.message
    try {
        await contact.save()
        res.redirect('/contact')
    } catch (err) {
        res.redirect('/contact')
    }
})


module.exports = router;