const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next()  
})

module.exports = mongoose.model('Note', noteSchema);




