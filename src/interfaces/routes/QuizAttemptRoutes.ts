import { Router } from "express";
import { QuizAttemptController } from "../controllers/QuizAttemptController";
import { VerifyUser } from "../../infrastructure/middleware/VerifyUser";
import { ProtectQuiz } from "../../infrastructure/middleware/ProtectQuiz";
import { VerifyQuestionAccess } from "../../infrastructure/middleware/VerifyQuestionAccess";
import { VerifyEmployeeOrSupervisor } from "../../infrastructure/middleware/VerifyEmployeeOrSpv";
import { VerifyQuizAttempt } from "../../infrastructure/middleware/VerifyQuizAttempt";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";

const router = Router();

router.post(
  "/start/:quizId",
  ProtectQuiz,
  VerifyQuestionAccess,
  verifyTokenBlacklist,
  QuizAttemptController.startQuiz
);
router.post(
  "/submit/:quizAttemptId",
  ProtectQuiz,
  VerifyQuizAttempt,
  verifyTokenBlacklist,
  QuizAttemptController.submitAnswer
);
router.get(
  "/detail-history/:id",
  VerifyEmployeeOrSupervisor,
  verifyTokenBlacklist,
  QuizAttemptController.getDetailQuizHistory
);
router.get(
  "/spv-history",
  VerifyUser,
  verifyTokenBlacklist,
  QuizAttemptController.getAllAttemptBySupervisor
);
router.get(
  "/:quizId",
  VerifyUser,
  verifyTokenBlacklist,
  QuizAttemptController.getAttemptResultByQuizId
);
router.get(
  "/history/:id",
  VerifyEmployeeOrSupervisor,
  verifyTokenBlacklist,
  QuizAttemptController.getAttemptHistory
);

export default router;
