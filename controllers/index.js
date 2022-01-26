const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home'
    })
});

// router.use(function(req, res, next){
//     res.status(404).render('404', {
//         pageTitle: 'Error',
//         isAuthenticated: false
//     })
// });

module.exports = router;