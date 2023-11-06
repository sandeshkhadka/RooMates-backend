import app from "./server";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketAuth } from "./modules/middlewares";

export type ChatMessageType = {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
};
type ChatMessagePayload = Omit<ChatMessageType, "id">;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.use(socketAuth);

io.on("connection", (socket) => {
  socket.join("chat");
  console.log("a user connected with id: ", socket.id);
  socket.on("clientToServerMessage", (msg: ChatMessagePayload) => {
    // console.log(msg);
    const id = Date.now().toString();
    const message: ChatMessageType = {
      message: msg.message,
      sender: msg.sender,
      timestamp: new Date().toISOString(),
      id: id,
    };
    io.to("chat").emit("serverToClientMessage", message);
    // socket.broadcast.emit("serverToClientMessage", message);
  });
});

io.on("disconnect", (socket) => {
  console.log("a user disconnected with id: ", socket.id);
});
export default io;
