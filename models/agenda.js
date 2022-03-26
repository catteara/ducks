const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const agendaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    day: {
        type: String,
        required: true
    },
    month: {
        type: Date,
        required: true
    },
    start: {
        type: String,
    },
    end: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Agenda', agendaSchema)