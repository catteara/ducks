const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home'
    })
});

//TODO: MOVE TO TODO ROUTES LATER
const isAuth = require('../middleware/is-auth')
router.get('/todo', isAuth, (req, res) => {
    res.render('todo', {
        pageTitle: 'To-Do List'
    })
});

// router.use(function(req, res, next){
//     res.status(404).render('404', {
//         pageTitle: 'Error',
//         isAuthenticated: false
//     })
// });

module.exports = router;