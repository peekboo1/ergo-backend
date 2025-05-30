import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
// import { VerifyUser } from "../middleware/VerifyUser";
import { ProtectQuiz } from "../../infrastructure/middleware/ProtectQuiz";
import { VerifyQuestionAccess } from "../../infrastructure/middleware/VerifyQuestionAccess";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";

const router = Router();

router.post(
  "/:quizId",
  authenticateJWT,
  verifyTokenBlacklist,
  QuestionController.createQuestion
);
router.put(
  "/:questionId",
  ProtectQuiz,
  VerifyQuestionAccess,
  verifyTokenBlacklist,
  QuestionController.updateQuestion
);
router.delete(
  "/:questionId",
  ProtectQuiz,
  VerifyQuestionAccess,
  verifyTokenBlacklist,
  QuestionController.deleteQuestion
);
router.get(
  "/:quizId",
  ProtectQuiz,
  VerifyQuestionAccess,
  verifyTokenBlacklist,
  QuestionController.getQuizQuestions
);

export default router;
