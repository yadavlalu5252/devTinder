const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");

const getSecretRoomId = (userId, targetUserId) => {

  return crypto.createHash("sha256")
    .update([userId, targetUserId].sort().join("-"))
    .digest("hex");
};

const initializeSocket = (server) => {

  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    
    // Handle Events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // const roomId = [userId, targetUserId].sort().join("-");
      const roomId = getSecretRoomId(userId, targetUserId);
      ;
      socket.join(roomId);

    });


    socket.on("sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {

        // Save messages to Database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: []
            })
          };

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            timeStamp: new Date(),
          }) // emit means server is sending message

        } catch (error) {
          console.log(error.message);
        }

      });




    socket.on("disconnect", () => {

    });


  });
}

module.exports = initializeSocket;