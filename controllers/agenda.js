const express = require('express');
const router = express.Router();
const Agenda = require('../models/agenda')
const isAuth = require('../middleware/is-auth');

const { title, day, month, start, end } = require('process');
const { details } = require('stream/consumers');
const moment = require('moment');

router.get('/agenda', isAuth, async (req, res) => {
    const agenda = await Agenda.find({
        userId: req.user._id
    }).sort({ month: 'asc'})
    let format = moment
    res.render('agenda/agenda', {
        pageTitle: 'Agenda',
        agenda: agenda,
        moment: format
    })
});

//Gets New Event Page
router.get('/agenda/new', isAuth, (req, res) => {
    res.render('agenda/new', {
        pageTitle: 'New Event',
        agenda: new Agenda()
    })
})

//Get to Edit Event Page
router.get('/agenda/edit/:id', isAuth, async (req, res) => {
    const agenda = await Agenda.findById(req.params.id)
    res.render('agenda/edit', {
        pageTitle: 'Edit Event',
        agenda: agenda //not sure about this
    })
});

//Returns (new) Event form on submission
router.post('/agenda', async (req, res, next) => {
    req.agenda = new Agenda({
        title: title,
        day: day,
        month: month,
        start: start,
        end: end,
        details: details,
        userId: req.user
    })
    let date = req.body.day
    let eventDate = moment(new Date(date)).utc().format('MMM Do')
    let eventMonth = moment(new Date(date)).format('L')
    
    let agenda = req.agenda
    agenda.day = eventDate
    agenda.title = req.body.title
    agenda.month = eventMonth
    agenda.start = req.body.start
    agenda.end = req.body.end
    agenda.details = req.body.details
    try {
        agenda = await agenda.save()
        res.redirect(`/agenda`)
    } catch (e) {
        res.redirect(`/agenda/new`)
        console.log(e)
    }
})

//Edit Event page
router.put('/agenda/:id', async (req, res, next) => {
    req.agenda = await Agenda.findById(req.params.id)
    let date = req.body.day
    let eventDate = moment(new Date(date)).utc().format('MMM Do')
    let eventMonth = moment(new Date(date)).format('L')
    let agenda = req.agenda
    agenda.day = eventDate
    agenda.title = req.body.title
    agenda.month = eventMonth
    agenda.start = req.body.start
    agenda.end = req.body.end
    agenda.details = req.body.details
    try {
        agenda = await agenda.save()
        res.redirect(`/agenda`)
    } catch (e) {
        res.redirect(`/agenda`)
    }
})


//Delete Event
router.delete('/agenda/:id', async (req, res) => {
    await Agenda.findByIdAndDelete(req.params.id)
    res.redirect('/agenda')
});

module.exports = router;