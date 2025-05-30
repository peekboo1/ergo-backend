import { Router } from "express";
import { QuizController } from "../controllers/QuizController";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { ProtectQuiz } from "../../infrastructure/middleware/ProtectQuiz";

const router = Router();

router.post(
  "/create",
  authenticateJWT,
  verifyTokenBlacklist,
  QuizController.createQuiz
);
router.put(
  "/update/:quizId",
  ProtectQuiz,
  verifyTokenBlacklist,
  ProtectQuiz,
  QuizController.updateQuiz
);
router.get(
  "/get-quiz",
  ProtectQuiz,
  verifyTokenBlacklist,
  QuizController.getAllQuizBySupervisorId
);

export default router;
