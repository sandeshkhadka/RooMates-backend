import app from "./server";
import "dotenv/config";
import io from "./chatServer";
import { errHandler } from "./modules/errors";
const PORT = Number(process.env.PORT);
const SOCKET_PORT = Number(process.env.SOCKET_PORT);
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
app.use(errHandler);
io.listen(SOCKET_PORT);
