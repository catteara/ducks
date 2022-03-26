const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const journalSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // image: {
    //     type: String,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
})

module.exports = mongoose.model('Journal', journalSchema)