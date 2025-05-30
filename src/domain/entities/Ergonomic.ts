export class Ergonomic {
  public id!: string;
  public userId!: string;
  public fileUrl!: string;
  public skorBahuRula!: number;
  public skorLeherReba!: number;
  public skorLututReba!: number;
  public skorPergelanganRula!: number;
  public skorSikuReba!: number;
  public skorSikuRula!: number;
  public skorTrunkReba!: number;
  public skorSudutBahu!: number;
  public skorSudutLeher!: number;
  public skorSudutLutut!: number;
  public skorSudutPahaPunggung!: number;
  public sudutPergelangan!: number;
  public sudutSiku!: number;
  public sudutSikuRula!: number;
  public totalReba!: number;
  public totalRula!: number;
  public feedback!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  constructor(
    id: string,
    userId: string,
    fileUrl: string,
    skorBahuRula: number,
    skorLeherReba: number,
    skorLututReba: number,
    skorPergelanganRula: number,
    skorSikuReba: number,
    skorSikuRula: number,
    skorTrunkReba: number,
    skorSudutBahu: number,
    skorSudutLeher: number,
    skorSudutLutut: number,
    skorSudutPahaPunggung: number,
    sudutPergelangan: number,
    sudutSiku: number,
    sudutSikuRula: number,
    totalReba: number,
    totalRula: number,
    feedback: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.fileUrl = fileUrl;
    this.skorBahuRula = skorBahuRula;
    this.skorLeherReba = skorLeherReba;
    this.skorLututReba = skorLututReba;
    this.skorPergelanganRula = skorPergelanganRula;
    this.skorSikuReba = skorSikuReba;
    this.skorSikuRula = skorSikuRula;
    this.skorTrunkReba = skorTrunkReba;
    this.skorSudutBahu = skorSudutBahu;
    this.skorSudutLeher = skorSudutLeher;
    this.skorSudutLutut = skorSudutLutut;
    this.skorSudutPahaPunggung = skorSudutPahaPunggung;
    this.sudutPergelangan = sudutPergelangan;
    this.sudutSiku = sudutSiku;
    this.sudutSikuRula = sudutSikuRula;
    this.totalReba = totalReba;
    this.totalRula = totalRula;
    this.feedback = feedback;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
