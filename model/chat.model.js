var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ChatSchema = new mongoose.Schema({
    members: [ObjectId],
    messages: [{
        isDeleted: { type: Boolean, default: false },
        message: { type: String },
        senderId: { type: ObjectId },
        receiverId: { type: ObjectId }
    }],
}, { timestamps: true });


const chats = mongoose.model('chat', ChatSchema);

module.exports = chats;