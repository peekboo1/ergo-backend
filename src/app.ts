import "./config/load-env";
import cors from "cors";
import express from "express";
import authRoutes from "./interfaces/routes/AuthRoutes";
import userRoutes from "./interfaces/routes/UserRoutes";
import companyRoutes from "./interfaces/routes/CompanyRoutes";
import divisionRoutes from "./interfaces/routes/DivisionRoutes";
import quizRoutes from "./interfaces/routes/QuizRoutes";
import employeeRoutes from "./interfaces/routes/EmployeeRoutes";
import ergonomicRoutes from "./interfaces/routes/ErgonomicRoutes";
import supervisorRoutes from "./interfaces/routes/SupervisorRoutes";
import questionRoutes from "./interfaces/routes/QuestionRoutes";
import quizAttempRoutes from "./interfaces/routes/QuizAttemptRoutes";
import optionRoutes from "./interfaces/routes/OptionRoutes";
import userAnswerRoutes from "./interfaces/routes/UserAnswerRoutes";
import superAdminRoutes from "./interfaces/routes/SuperAdminRoutes";

const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/personal", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/ergonomic", ergonomicRoutes);
app.use("/api/quiz-attempt", quizAttempRoutes);
app.use("/api/option", optionRoutes);
app.use("/api/user-answer", userAnswerRoutes);
app.use("/api/super-admin", superAdminRoutes);

export default app;
