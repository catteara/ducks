const path = require('path');
const express = require('express')
const Journal = require('../models/journal')
const router = express.Router()
const isAuth = require('../middleware/is-auth');
const {
    title
} = require('process');
const {
    text
} = require('stream/consumers');

router.get('/', isAuth, async (req, res) => {
    const journal = await Journal.find({
        userId: req.user._id
    }).sort({
        date: 'desc'
    })
    res.render('journal/journal', {
        pageTitle: 'Journal',
        journal: journal
    })
});

router.get('/new', isAuth, (req, res) => {
    res.render('journal/new', {
        pageTitle: 'New Entry',
        journal: new Journal({
            title: '',
            text: '',
        })
    })
});

router.get('/edit/:id', isAuth, async (req, res) => {
    const journal = await Journal.findById(req.params.id)
    res.render('journal/edit', {
        pageTitle: 'Edit Entry',
        journal: journal
    })
});

router.get('/:id', isAuth, async (req, res) => {
    const journal = await Journal.findById(req.params.id)
    if (journal == null) res.redirect('/404')
    res.render('journal/entry', {
        pageTitle: journal.title,
        journal: journal
    })
});

router.post('/', async (req, res, next) => {
    req.journal = new Journal({
        title: title,
        text: text,
        userId: req.user
    })
    let journal = req.journal
    journal.title = req.body.title
    journal.text = req.body.text
    try {
        journal = await journal.save()
        res.redirect(`journal/${journal.id}`)
    } catch (e) {
        res.redirect(`/new`)
    }
})

router.put('/:id', async (req, res, next) => {
    req.journal = await Journal.findById(req.params.id)
    let journal = req.journal
    journal.title = req.body.title
    journal.text = req.body.text
    try {
        journal = await journal.save()
        res.redirect(`${journal.id}`)
    } catch (e) {
        res.redirect(`/edit`)
    }
})

router.delete('/:id', async (req, res) => {
    await Journal.findByIdAndDelete(req.params.id)
    res.redirect('/journal')
});

module.exports = router;