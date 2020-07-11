const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    conservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conservations',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

module.exports = Message = mongoose.model('messages', MessageSchema);