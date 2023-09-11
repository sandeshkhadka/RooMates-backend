import express from "express";
import router from "./router";
import cors from "cors";
import {
  // authMiddleware,
  signInMiddleware,
  signUpMiddleware,
} from "./modules/middlewares";
import { signin, signup } from "./handlers/signin_signup";
import { body } from "express-validator";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/signup",
  body(["username", "password", "email"]).exists(),
  signUpMiddleware,
  signup,
);
app.post(
  "/signin",
  body(["username", "password"]).exists(),
  signInMiddleware,
  signin,
);

// app.use("/api", authMiddleware, router);
app.use("/api", router);
export default app;
