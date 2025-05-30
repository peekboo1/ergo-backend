import { Router } from "express";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
import { DivisionController } from "../controllers/DivisionController";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { ProtectDivision } from "../../infrastructure/middleware/ProtectDivision";

const router = Router();

router.post(
  "/register",
  authenticateJWT,
  verifyTokenBlacklist,
  DivisionController.registerDivision
);
router.get(
  "/get-all-division",
  authenticateJWT,
  verifyTokenBlacklist,
  DivisionController.getAllDivision
);
router.put(
  "/:id",
  authenticateJWT,
  ProtectDivision,
  verifyTokenBlacklist,
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  authenticateJWT,
  ProtectDivision,
  verifyTokenBlacklist,
  DivisionController.deleteDivision
);

export default router;
