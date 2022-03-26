const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const Habit = require("../models/habit");

router.get('/', isAuth, (req, res) => {

    Habit.find({
        userId: req.user._id
    }, (err, habits) => {
        if (err) console.log(err)
        else {
            var days = [];
            days.push(getD(-6))
            days.push(getD(-5))
            days.push(getD(-4))
            days.push(getD(-3))
            days.push(getD(-2))
            days.push(getD(-1))
            days.push(getD(0))
            res.render('habit/dashboard', {
                pageTitle: 'Habit Tracker',
                habits: habits,
                days: days
            })
        }
    })
});

//Function used to return date string
function getD(n) {
    let d = new Date()
    d.setDate(d.getDate() + n)
    var newDate = d.toLocaleDateString('pt-br').split('/').reverse().join('-')
    var day
    switch (d.getDay()) {
        case 0:
            day = 'Sun'
            break;
        case 1:
            day = 'Mon'
            break;
        case 2:
            day = 'Tue'
            break;
        case 3:
            day = 'Wed'
            break;
        case 4:
            day = 'Thu'
            break;
        case 5:
            day = 'Fri'
            break;
        case 6:
            day = 'Sat'
            break;
    }
    return {
        date: newDate,
        day
    }
}

router.get('/edit/:id', isAuth, (req, res) => {
    const id = req.params.id
    Habit.find({
        userId: req.user._id
    }, (err, habit) => {
        res.render("habit/edit", {
            habit: habit,
            idHabit: id,
            pageTitle: 'Edit Habit'
        })
    })
});

// New Habit
router.post('/', (req, res) => {
    const {
        content
    } = req.body;
    let userId = req.user

    Habit.findOne({
        content: content,
        userId: userId
    }).then(habit => {
        let dates = [],
            tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
        dates.push({
            date: localISOTime,
            complete: 'none'
        });
        const newHabit = new Habit({
            content,
            userId,
            dates
        });
        newHabit
            .save()
            .then(habit => {
                console.log(habit);
                res.redirect('back');
            })
            .catch(err => console.log(err));
    })
});

router.post('/edit/:id', (req, res) => {
    const id = req.params.id
    Habit.findByIdAndUpdate(id, {
        content: req.body.content
    }, err => {
        if (err) return res.send(500, err)
        res.redirect("/habit")
    })
})

router.get('/status-update', (req, res) => {
    var d = req.query.date;
    var id = req.query.id;
    Habit.findById(id, (err, habit) => {
        if (err) {
            console.log("Error updating status!")
        } else {
            let dates = habit.dates;
            let found = false;
            dates.find(function (item, index) {
                if (item.date === d) {
                    if (item.complete === 'yes') {
                        item.complete = 'no';
                    } else if (item.complete === 'no') {
                        item.complete = 'none'
                    } else if (item.complete === 'none') {
                        item.complete = 'yes'
                    }
                    found = true;
                }
            })
            if (!found) {
                dates.push({
                    date: d,
                    complete: 'yes'
                })
            }
            habit.dates = dates;
            habit.save()
                .then(habit => {
                    console.log(habit);
                    res.redirect('/habit');
                })
                .catch(err => console.log(err));
        }
    })
})

router.get('/remove/:id', (req, res) => {
    const id = req.params.id
    Habit.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err)
        res.redirect('back')
    })
})

module.exports = router;