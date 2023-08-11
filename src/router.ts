import { Router } from "express";
const router = Router();

router.get("/task", () => { });
router.get("/contribution");

router.get("/user/:id");
router.get("/task/:id");
router.get("/contribution/:id");

router.post("/task");
router.post("/contribution");

router.put("/task/:id");
router.put("/contribution/:id");

export default router;
