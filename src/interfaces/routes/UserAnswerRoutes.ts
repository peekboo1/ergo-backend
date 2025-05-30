import { Router } from "express";
import { UserAnswerController } from "../controllers/UserAnswerController";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { ProtectQuizData } from "../../infrastructure/middleware/ProtectQuizData";

const router = Router();

router.get(
  "/attempt/:attemptId",
  verifyTokenBlacklist,
  ProtectQuizData,
  UserAnswerController.getAnswersByAttemptId
);
router.get("/user/:userId", UserAnswerController.getAnswersByUserId);

export default router;
