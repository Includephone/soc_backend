const mongoose = require('mongoose');

const ConservationSchema = mongoose.Schema({
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

module.exports = Conservation = mongoose.model('conservations', ConservationSchema);