const ChatModel = require("../../model/chat.model");
const AdminModel = require("../../model/adminModel/adminModels");

const addMessage = async ({ chatId, message, senderId, receiverId }) => {
  try {
    const chat = await ChatModel.findOne(
      {
        $and: [
          { members: { "$in": [senderId] } },
          { members: { "$in": [receiverId] } }]
      });

    if (chat) {
      const messageObj = {
        message,
        senderId,
        receiverId
      }
      const data = await ChatModel.findByIdAndUpdate(chat._id,
        { $push: { messages: messageObj } },
        { new: true }
      );
    } else if (senderId && receiverId) {
      const chat = new ChatModel({
        members: [senderId, receiverId],
        messages: [{
          message,
          senderId,
          receiverId
        }]
      })
      const data = await chat.save();
    }
  } catch (error) {
    return {}
  }
}

const fetchChat = async (req, res) => {
  const { chatId, senderId, receiverId } = req.body;
  try {
    const admin = await AdminModel.findOne({}, {});

    const chat = await ChatModel.findOne(
      {
        $and: [
          { members: { "$in": [senderId] } },
          { members: { "$in": [receiverId] } }]
      });
    res.json({
      status: true,
      message: 'Chats fetched successfully',
      chatId: chat !== null && chat._id !== undefined ? chat._id : undefined,
      messageList: chat !== null && chat.messages !== undefined ? chat.messages : [],
      receiverId: admin._id
    });

  } catch (error) {
    res.json({ status: false, message: 'SomeThing Went Wrong' });
  }
}


module.exports = { addMessage, fetchChat };