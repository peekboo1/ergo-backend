import { DivisionModel } from "../db/models/DivisionModels";

export async function ProtectDivision(req: any, res: any, next: any) {
  const divisionId = req.params.id;
  const companyId = res.locals.companyId;

  try {
    const division = await DivisionModel.findByPk(divisionId);

    if (!division) {
      return res.status(404).json({
        error: true,
        message: "Division not found.",
        data: null,
      });
    }

    if (division.companyId !== companyId) {
      return res.status(403).json({
        error: true,
        message: "You do not have access to this division.",
        data: null,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
      data: error,
    });
  }
}
