const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const calendarSchema = new Schema({
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
    time: {
        type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
})

module.exports = mongoose.model('Calendar', calendarSchema)