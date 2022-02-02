const express = require('express');
const router = express.Router();
const Calendar = require('../models/calendar')
const isAuth = require('../middleware/is-auth');

const { title, day, month, time } = require('process');
const { details } = require('stream/consumers');
const moment = require('moment')

router.get('/calendar', isAuth, async (req, res) => {
    const calendar = await Calendar.find({
        userId: req.user._id
    }).sort({ month: 'asc'})
    let format = moment
    res.render('calendar/calendar', {
        pageTitle: 'Calendar',
        calendar: calendar,
        moment: format
    })
});

//Gets New Event Page
router.get('/calendar/new', isAuth, (req, res) => {
    res.render('calendar/new', {
        pageTitle: 'New Event',
        calendar: new Calendar()
    })
})

//Get to Edit Event Page
router.get('/calendar/edit/:id', isAuth, async (req, res) => {
    const calendar = await Calendar.findById(req.params.id)
    res.render('calendar/edit', {
        pageTitle: 'Edit Event',
        calendar: calendar //not sure about this
    })
});

//Gets Daily View with id TODO: change to day(date) instead
router.get('/calendar/:id', isAuth, async (req, res) => {
    const calendar = await Calendar.findById(req.params.id)
    res.render('calendar/day', {
        pageTitle: calendar.date,
        calendar: calendar
    })
});

//Returns (new) Event form on submission
router.post('/calendar', async (req, res, next) => {
    req.calendar = new Calendar({
        title: title,
        day: day,
        month: month,
        time: time,
        details: details,
        userId: req.user
    })
    let date = req.body.day
    let eventDate = moment(new Date(date)).format('MMM Do')
    let eventMonth = moment(new Date(date)).format('L')
    let calendar = req.calendar
    calendar.day = eventDate
    calendar.title = req.body.title
    calendar.month = eventMonth
    calendar.time = req.body.time
    calendar.details = req.body.details
    try {
        calendar = await calendar.save()
        res.redirect(`/calendar`)
    } catch (e) {
        res.redirect(`/calendar/new`)
        console.log(e)
    }
})

//Edit Event page
router.put('/calendar/:id', async (req, res, next) => {
    req.calendar = await Calendar.findById(req.params.id)
    let date = req.body.day
    let eventDate = moment(new Date(date)).format('MMM Do')
    let calendar = req.calendar
    let month = req.body.month
    let eventMonth = moment(new Date(month)).format('L')
    calendar.day = eventDate
    calendar.title = req.body.title
    calendar.month = eventMonth
    calendar.time = req.body.time
    calendar.details = req.body.details
    try {
        calendar = await calendar.save()
        res.redirect(`${calendar.id}`)
    } catch (e) {
        res.redirect(`/calendar/edit`)
    }
})


//Delete Event
router.delete('/calendar/:id', async (req, res) => {
    await Calendar.findByIdAndDelete(req.params.id)
    res.redirect('/calendar')
});

module.exports = router;