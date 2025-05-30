export class Quiz {
  public id: string;
  public title: string;
  public supervisorId: string;

  constructor(id: string, title: string, supervisorId: string) {
    this.id = id;
    this.title = title;
    this.supervisorId = supervisorId;
  }
}
