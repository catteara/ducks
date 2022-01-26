const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const Todo = require("../models/todo");

router.get('/', isAuth, (req, res) => {
    Todo.find({userId: req.user._id}, (err, tasks) =>
        res.render('todo/todo', {
            pageTitle: 'To-Do List',
            todo: tasks
        })
    )
});

router.get('/edit/:id', isAuth, (req, res) => {
    const id = req.params.id
    Todo.find({}, (err, tasks) => {
        res.render("todo/edit", {
            todo: tasks, 
            idTask: id, 
            pageTitle: 'Edit Entry'
        })
    })
});

router.post('/', async (req, res) => {
    const todo = new Todo({
        content: req.body.content,
        userId: req.user
    })
    try {
        await todo.save()
        res.redirect('/todo')
    } catch (err) {
        res.redirect('/todo')
    }
})

router.post('/edit/:id', (req, res) => {
    const id = req.params.id
    Todo.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err)
        res.redirect("/todo")
    })
})

router.get('/remove/:id', (req, res) => {
    const id = req.params.id
    Todo.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err)
        res.redirect('/todo')
    })
})

module.exports = router;