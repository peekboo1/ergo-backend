import { Router } from "express";
import { AuthController } from "../controllers/AuthContoller";

const router = Router();

router.post("/super-admin/login", AuthController.superAdminLogin);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
