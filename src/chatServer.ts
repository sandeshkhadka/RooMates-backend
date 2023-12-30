import app from "./server";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketAuth } from "./modules/middlewares";
import {
  createMessage,
  getRecentMessages,
  deleteMessage,
} from "./handlers/chat";
// export type ChatMessageType = {
//   id: string;
//   message: string;
//   sender: string;
//   timestamp: string;
// };
// type ChatMessagePayload = Omit<ChatMessageType, "id">;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.use(socketAuth);

io.on("connection", async (socket) => {
  socket.join("chat");
  const recentMessages = await getRecentMessages();
  socket.emit("recentMessages", recentMessages);
  console.log("a user connected with id: ", socket.id);
  socket.on("clientToServerMessage", async (msg: ChatMessagePayload) => {
    // console.log(msg);
    const message = await createMessage(msg);
    io.to("chat").emit("serverToClientMessage", message);
    // socket.broadcast.emit("serverToClientMessage", message);
  });

  socket.on(
    "deleteMessage",
    async (message: { messageId: string; initiater: string }) => {
      const deleted = await deleteMessage(message.messageId, message.initiater);
      if (deleted) {
        io.to("chat").emit("messageDeleted", message.messageId);
      }
    },
  );
});

io.on("disconnect", (socket) => {
  console.log("a user disconnected with id: ", socket.id);
});
export default io;
