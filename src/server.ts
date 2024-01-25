import express from "express";
import router from "./router.js";
import cors from "cors";
import {
  authMiddleware,
  signInMiddleware,
  requestSignUpMiddleware,
  assertAllFieldsPresent,
  // signUpMiddleware,
} from "./modules/middlewares.js";
import { signin, signup, requestSignup } from "./handlers/signin_signup.js";
import { body } from "express-validator";
import morgan from "morgan";
import { requestResetLink, resetPassword } from "./handlers/settings.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/signup",
  // body(["password", "token", "profile"]).exists(),
  // signUpMiddleware,
  signup,
);
app.post(
  "/request_signup",
  body(["username", "email"]).exists(),
  requestSignUpMiddleware,
  requestSignup,
);
app.post(
  "/request_reset",
  body("email").exists(),
  assertAllFieldsPresent,
  requestResetLink,
);
app.post(
  "/reset_password",
  body(["token", "newPassword"]).exists(),
  assertAllFieldsPresent,
  resetPassword,
);
app.post(
  "/signin",
  body(["username", "password"]).exists(),
  signInMiddleware,
  signin,
);

app.use("/api", authMiddleware, router);
// app.use("/api", router);
export default app;
