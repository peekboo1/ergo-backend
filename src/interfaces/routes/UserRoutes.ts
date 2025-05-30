import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { ProtectMyData } from "../../infrastructure/middleware/ProtectMyData";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";

const router = Router();
router.post("/register", UserController.createPersonal);

router.get(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  UserController.getPersonal
);

router.put(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  UserController.updatePersonal
);

router.delete(
  "/:id",
  ProtectMyData,
  verifyTokenBlacklist,
  UserController.deletePersonal
);

export default router;
