const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
})

module.exports = Friend = mongoose.model('friends', FriendSchema);