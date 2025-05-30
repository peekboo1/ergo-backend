import { IErgonomicAnalysisRepository } from "../../repositories/IErgonomicRepository";
import PdfPrinter from "pdfmake";

export class DownloadEmployeeErgonomicPDFUseCase {
  constructor(private repo: IErgonomicAnalysisRepository) {}

  async execute(employeeId: string, supervisorId: string): Promise<Buffer> {
    const data = await this.repo.getErgonomicsHistory(employeeId);

    if (!data || data.length === 0) {
      throw new Error("No ergonomic data found for this employee.");
    }

    const printer = new PdfPrinter({
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    });

    const tableBody = [
      [
        "File URL",
        "Bahu Rula",
        "Leher Reba",
        "Lutut Reba",
        "Pergelangan Rula",
        "Siku Reba",
        "Siku Rula",
        "Trunk Reba",
        "Sudut Bahu",
        "Sudut Leher",
        "Sudut Lutut",
        "Sudut Paha Punggung",
        "Sudut Pergelangan",
        "Sudut Siku",
        "Sudut Siku Rula",
        "Total Reba",
        "Total Rula",
        "Feedback",
      ],
      ...data.map((d: any) => [
        d.fileUrl,
        d.skorBahuRula,
        d.skorLeherReba,
        d.skorLututReba,
        d.skorPergelanganRula,
        d.skorSikuReba,
        d.skorSikuRula,
        d.skorTrunkReba,
        d.skorSudutBahu ?? "-",
        d.skorSudutLeher ?? "-",
        d.skorSudutLutut ?? "-",
        d.skorSudutPahaPunggung ?? "-",
        d.sudutPergelangan ?? "-",
        d.sudutSiku ?? "-",
        d.sudutSikuRula ?? "-",
        d.totalReba ?? "-",
        d.totalRula ?? "-",
        d.feedback ?? "-",
      ]),
    ];

    const docDefinition: any = {
      pageSize: "A4",
      pageOrientation: "landscape",
      content: [
        {
          text: "Ergonomic Analysis Report",
          style: "header",
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: [
              "10%",
              "auto",

              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
        },
      },
      defaultStyle: {
        font: "Helvetica",
        fontSize: 8,
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    });
  }
}
