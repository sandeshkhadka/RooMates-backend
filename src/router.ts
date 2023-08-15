import { Router } from "express";
import { body } from "express-validator";
import { createTask, getTaskById, getTasks, updateTask } from "./handlers/task";
import {
  contributionMiddleware,
  createTaskMiddleware,
} from "./modules/middlewares";
import {
  createContribution,
  getContributionById,
  getContributions,
  updateContibutions,
} from "./handlers/contribution";
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

// router.get("/user/:id");
router.get("/task/:id", getTaskById);
router.get("/contribution/:id", getContributionById);

router.post(
  "/task",
  body("name").exists().notEmpty(),
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

export default router;
