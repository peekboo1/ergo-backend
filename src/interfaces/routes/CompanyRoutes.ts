import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { authenticateJWT } from "../../infrastructure/middleware/authenticateJWT";
import { verifyTokenBlacklist } from "../../infrastructure/middleware/VerifyTokenBlacklist";

const router = Router();

router.post("/register", CompanyController.registerCompany);
router.put(
  "/:companyId",
  authenticateJWT,
  verifyTokenBlacklist,
  CompanyController.updateCompany
);
router.get("/get-all-company", CompanyController.getAllCompany);

export default router;
