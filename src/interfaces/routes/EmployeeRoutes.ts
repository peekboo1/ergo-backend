import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
import { validateEmployeeIdParam } from "../../infrastructure/middleware/ValidateEmployeeId";
import { VerifyEmployeeOrSupervisor } from "../../infrastructure/middleware/VerifyEmployeeOrSpv";

const router = Router();

router.post(
  "/register",
  authenticateJWT,
  verifyTokenBlacklist,
  EmployeeController.registerEmployee
);

router.get(
  "/:id",
  validateEmployeeIdParam,
  VerifyEmployeeOrSupervisor,
  verifyTokenBlacklist,
  EmployeeController.getEmployee
);
router.put(
  "/:id",
  validateEmployeeIdParam,
  VerifyEmployeeOrSupervisor,
  verifyTokenBlacklist,
  EmployeeController.updateEmployee
);

router.delete(
  "/:id",
  validateEmployeeIdParam,
  VerifyEmployeeOrSupervisor,
  verifyTokenBlacklist,
  EmployeeController.deleteEmployee
);

export default router;
