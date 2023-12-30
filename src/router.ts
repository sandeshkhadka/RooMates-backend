import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "./handlers/task";
import {
  contributionMiddleware,
  createTaskMiddleware,
} from "./modules/middlewares";
import {
  approveContribution,
  createContribution,
  deleteContribuion,
  getContributionById,
  getContributions,
  updateContibutions,
} from "./handlers/contribution";
import { getAllUsers, rehydrate } from "./handlers/users";
import { getContributionDistribution, getPendingTasks } from "./handlers/dashboard";
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

router.get("/task", getTasks);
router.get("/contribution", getContributions);

router.get("/users", getAllUsers);
router.get("/rehydrate", rehydrate);
router.get("/task/:id", getTaskById);
router.get("/contribution/id/:id", getContributionById);
router.get("/dashboard/contribution/distribution", getContributionDistribution);
router.get("/dashboard/task/pending", getPendingTasks);

router.post(
  "/task",
  body("name").exists().notEmpty(),
  body("assignToId").exists().notEmpty(),
  createTaskMiddleware,
  createTask,
);
router.post(
  "/contribution",
  body(["name", "type", "amount"]).exists(),
  body("type").isIn(ContributionTypes),
  body("amount").isNumeric(),
  contributionMiddleware,
  createContribution,
);
router.post("/contribution/approve/:id", approveContribution);
router.put(
  "/task/:id",
  body("name").notEmpty(),
  body("status").exists().isIn(["Pending", "Completed", "Missed"]),
  createTaskMiddleware,
  updateTask,
);
router.put(
  "/contribution/:id",
  body(["name", "type", "amount"]).exists(),
  body("type").isIn(ContributionTypes),
  body("amount").isNumeric(),
  contributionMiddleware,
  updateContibutions,
);
router.delete("/contribution/:id", deleteContribuion);
router.delete("/task/:id", deleteTask);
export default router;
