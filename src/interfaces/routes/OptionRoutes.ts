import { Router } from "express";
import { OptionController } from "../controllers/OptionController";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
import { ProtectQuiz } from "../../infrastructure/middleware/ProtectQuiz";
import { VerifyQuestionAccess } from "../../infrastructure/middleware/VerifyQuestionAccess";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";

const router = Router();

router.post(
  "/:questionId",
  authenticateJWT,
  verifyTokenBlacklist,
  OptionController.addOptions
);

router.get(
  "/:questionId",
  ProtectQuiz,
  VerifyQuestionAccess,
  OptionController.getOptionsByQuestionId
);

export default router;
