import { QuizModel } from "./QuizModels";
import { UserModel } from "./UserModels";
import { OptionModel } from "./OptionModels";
import { CompanyModel } from "./CompanyModels";
import { EmployeeModel } from "./EmployeeModels";
import { DivisionModel } from "./DivisionModels";
import { QuestionModel } from "./QuestionModels";
import { ErgonomicModel } from "./ErgonomicModels";
import { UserAnswerModel } from "./UserAnswerModels";
import { SupervisorModel } from "./SupervisorModels";
import { QuizAttemptModel } from "./QuizAttemptModels";
import { SuperadminModel } from "./SuperadminModel";
import { ErgonomicVideoModel } from "./ErgonomicVideoModels";

export const defineAssociations = () => {
  SupervisorModel.hasMany(EmployeeModel, {
    foreignKey: "supervisorId",
    as: "employees",
  });
  EmployeeModel.belongsTo(SupervisorModel, {
    foreignKey: "supervisorId",
    as: "supervisor",
  });

  CompanyModel.hasMany(EmployeeModel, {
    foreignKey: "companyId",
    as: "employees",
  });
  EmployeeModel.belongsTo(CompanyModel, {
    foreignKey: "companyId",
    as: "company",
  });

  DivisionModel.hasMany(EmployeeModel, {
    foreignKey: "divisionId",
  });
  EmployeeModel.belongsTo(DivisionModel, {
    foreignKey: "divisionId",
  });

  CompanyModel.hasMany(DivisionModel, {
    foreignKey: "companyId",
    as: "divisions",
  });
  DivisionModel.belongsTo(CompanyModel, {
    foreignKey: "companyId",
    as: "company",
  });

  SupervisorModel.hasMany(QuizModel, {
    foreignKey: "supervisorId",
    as: "quizzes",
  });
  QuizModel.belongsTo(SupervisorModel, {
    foreignKey: "supervisorId",
    as: "supervisor",
  });

  QuizModel.hasMany(QuestionModel, { foreignKey: "quizId", as: "questions" });
  QuestionModel.belongsTo(QuizModel, { foreignKey: "quizId", as: "quiz" });

  QuestionModel.hasMany(OptionModel, {
    foreignKey: "questionId",
    as: "options",
    onDelete: "CASCADE",
    hooks: true,
  });
  OptionModel.belongsTo(QuestionModel, {
    foreignKey: "questionId",
    as: "question",
  });

  EmployeeModel.hasMany(QuizAttemptModel, {
    foreignKey: "userId",
    as: "attempts",
  });
  QuizAttemptModel.belongsTo(EmployeeModel, {
    foreignKey: "userId",
    as: "user",
  });

  QuizModel.hasMany(QuizAttemptModel, { foreignKey: "quizId", as: "attempts" });
  QuizAttemptModel.belongsTo(QuizModel, { foreignKey: "quizId", as: "quiz" });

  QuizAttemptModel.hasMany(UserAnswerModel, {
    foreignKey: "attemptId",
    as: "answers",
  });
  UserAnswerModel.belongsTo(QuizAttemptModel, {
    foreignKey: "attemptId",
    as: "attempt",
  });

  OptionModel.hasMany(UserAnswerModel, {
    foreignKey: "selectedOptionId",
    as: "userAnswers",
  });
  UserAnswerModel.belongsTo(OptionModel, {
    foreignKey: "selectedOptionId",
    as: "option",
  });

  EmployeeModel.hasMany(UserAnswerModel, {
    foreignKey: "userId",
    as: "userAnswers",
  });
  UserAnswerModel.belongsTo(EmployeeModel, {
    foreignKey: "userId",
    as: "user",
  });
};
