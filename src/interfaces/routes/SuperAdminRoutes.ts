import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { VerifySuperadmin } from "../../infrastructure/middleware/VerifySuperadmin";
import { SupervisorController } from "../controllers/SupervisorContoller";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";
import { EmployeeController } from "../controllers/EmployeeController";

const router = Router();

router.get(
  "/get-all-users",
  VerifySuperadmin,
  verifyTokenBlacklist,
  UserController.getAllPersonal
);

router.get(
  "/get-all-supervisors",
  VerifySuperadmin,
  verifyTokenBlacklist,
  SupervisorController.getAllSupervisor
);

router.get(
  "/get-all-employees",
  VerifySuperadmin,
  verifyTokenBlacklist,
  EmployeeController.getAllEmployee
);

router.put(
  "/personal-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  UserController.updatePersonal
);

router.get(
  "/employee-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  EmployeeController.getEmployee
);

router.get(
  "/personal-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  UserController.getPersonal
);

router.put(
  "/employee-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  EmployeeController.updateEmployee
);

router.delete(
  "/spv-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  SupervisorController.deleteSupervisor
);

router.get(
  "/spv-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  SupervisorController.getSupervisor
);

router.put(
  "/spv-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  SupervisorController.updateSupervisor
);

router.delete(
  "/employee-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  EmployeeController.deleteEmployee
);

router.delete(
  "/personal-data/:id",
  VerifySuperadmin,
  verifyTokenBlacklist,
  UserController.deletePersonal
);

export default router;
