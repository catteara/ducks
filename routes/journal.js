const express = require('express')
const Journal = require('./../models/journal')
const router = express.Router()

// Gets Journal Main Page
router.get('/', async (req, res) => {
    const journal = await Journal.find().sort({ date: 'desc'})
    res.render('journal/journal', {journal: journal})
})

//Gets New Entry Page
router.get('/new', (req, res) => {
    res.render('journal/new', {journal: new Journal() })
})

//Get to Edit Entry Page
router.get('/edit/:id', async (req, res) => {
    const journal = await Journal.findById(req.params.id)
    res.render('journal/edit', {journal: journal })
})

//Gets Entry description page with Id
router.get('/:id', async (req, res) => {
    const journal = await Journal.findById(req.params.id)
    if (journal == null) res.redirect('/')
    res.render('journal/entry', { journal: journal })
})

//Returns New Entry Form on Submission
router.post('/', async (req, res, next) => {
    req.journal = new Journal()
    next()
}, saveAndRedirect('new'))

//Edit entry page
router.put('/:id', async (req, res, next) => {
    req.journal = await Journal.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))


//Delete Journal journal
router.delete('/:id', async (req, res) => {
    await Journal.findByIdAndDelete(req.params.id)
    res.redirect('/journal')
})

function saveAndRedirect(path) {
    return async (req, res) => {
        let journal = req.journal
        journal.title = req.body.title
        journal.text = req.body.text
        try {
            journal = await journal.save()
            res.redirect(`/journal/${journal.id}`)
        } catch (e) {
            res.render(`journal/${path}`, {journal: journal})
        }
    }
}

module.exports = router;