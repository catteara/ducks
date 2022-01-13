const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/todo', (req, res) => {
    res.render('todo')
})

module.exports = router;