import app from "./server.js";
import "dotenv/config";
import io from "./chatServer.js";
import { errHandler } from "./modules/errors.js";
export const PORT = Number(process.env.PORT);
const SOCKET_PORT = Number(process.env.SOCKET_PORT);
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
app.use(errHandler);
io.listen(SOCKET_PORT);
