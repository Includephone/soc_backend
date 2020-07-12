const mongoose = require('mongoose');

const DialogSchema = mongoose.Schema({
        user1:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        user2:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
},
{
    timestamps: true
})

module.exports = Dialog = mongoose.model('dialogs', DialogSchema);