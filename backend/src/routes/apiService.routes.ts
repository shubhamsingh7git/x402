import { Router } from "express";
import { apiServiceController } from "../controllers/apiService.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, (req, res, next) => apiServiceController.list(req, res, next));
router.get("/:id", authMiddleware, (req, res, next) => apiServiceController.getById(req, res, next));
router.post("/", authMiddleware, (req, res, next) => apiServiceController.create(req, res, next));
router.put("/:id", authMiddleware, (req, res, next) => apiServiceController.update(req, res, next));
router.patch("/:id/toggle", authMiddleware, (req, res, next) => apiServiceController.toggle(req, res, next));
router.delete("/:id", authMiddleware, (req, res, next) => apiServiceController.delete(req, res, next));

export default router;
