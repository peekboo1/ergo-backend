import { Router } from "express";
import { VerifyUser } from "../../infrastructure/middleware/VerifyUser";
import { ProtectMyData } from "../../infrastructure/middleware/ProtectMyData";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { EmployeeController } from "../controllers/EmployeeController";
import { SupervisorController } from "../controllers/SupervisorContoller";

const router = Router();

router.post("/register", SupervisorController.registerSupervisor);

router.get(
  "/get-all-employee",
  VerifyUser,
  verifyTokenBlacklist,
  EmployeeController.getAllEmployeeBySupervisorId
);

router.get(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  SupervisorController.getSupervisor
);

router.put(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  SupervisorController.updateSupervisor
);

router.delete(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  SupervisorController.deleteSupervisor
);

export default router;
