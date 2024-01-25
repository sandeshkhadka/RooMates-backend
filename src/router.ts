import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "./handlers/task.js";
import { assertAllFieldsPresent } from "./modules/middlewares.js";
import {
  approveContribution,
  createContribution,
  deleteContribuion,
  getContributionById,
  getContributions,
  updateContibutions,
} from "./handlers/contribution.js";
import { getAllUsers, rehydrate } from "./handlers/users.js";
import {
  getContributionDistribution,
  getPendingTasks,
} from "./handlers/dashboard.js";
import {
  changePassword,
  changeProfilePicture,
  changeUsername,
  getProfilePicture,
} from "./handlers/settings.js";
import { errHandler } from "./modules/errors.js";
const ContributionTypes = [
  "vegetables",
  "water",
  "nonVegs",
  "khaja",
  "gas",
  "payments",
  "others",
];
const router = Router();
router.use(errHandler);
router.get("/task", getTasks);
router.get("/contribution", getContributions);
router.get("/users", getAllUsers);
router.get("/rehydrate", rehydrate);
router.get("/task/:id", getTaskById);
router.get("/contribution/id/:id", getContributionById);
router.get("/dashboard/contribution/distribution", getContributionDistribution);
router.get("/dashboard/task/pending", getPendingTasks);

router.get("/profile_picture/id/:id", getProfilePicture);

router.post(
  "/task",
  body("name").exists().notEmpty(),
  body("assignToId").exists().notEmpty(),
  assertAllFieldsPresent,
  createTask,
);
router.post(
  "/contribution",
  body(["name", "type", "amount"]).exists(),
  body("type").isIn(ContributionTypes),
  body("amount").isNumeric(),
  assertAllFieldsPresent,
  createContribution,
);
router.post("/contribution/approve/:id", approveContribution);
router.put(
  "/task/:id",
  body("name").notEmpty(),
  body("status").exists().isIn(["Pending", "Completed", "Missed"]),
  assertAllFieldsPresent,
  updateTask,
);
router.put(
  "/settings/username",
  body("newUsername").exists(),
  assertAllFieldsPresent,
  changeUsername,
);
router.put(
  "/settings/password",
  body(["oldPassword", "newPassword"]).exists(),
  assertAllFieldsPresent,
  changePassword,
);
router.put("/settings/profile_picture", changeProfilePicture);
router.put(
  "/contribution/:id",
  body(["name", "type", "amount"]).exists(),
  body("type").isIn(ContributionTypes),
  body("amount").isNumeric(),
  assertAllFieldsPresent,
  updateContibutions,
);
router.delete("/contribution/:id", deleteContribuion);
router.delete("/task/:id", deleteTask);
export default router;
