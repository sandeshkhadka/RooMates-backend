import express from "express";
import router from "./router";
import { authMiddleware } from "./modules/middlewares";
import { signin, signup } from "./handlers/signin_signup";
import { body } from "express-validator";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", body(["username", "password", "email"]).exists(), signup);
app.post("/signin", body(["username", "password"]).exists(), signin);

app.use("/api", authMiddleware, router);
export default app;
