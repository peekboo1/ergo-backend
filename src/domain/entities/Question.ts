export class Question {
  public id!: string;
  public question!: string;
  public quizId!: string;

  constructor(id: string, question: string, quizId: string) {
    this.id = id;
    this.question = question;
    this.quizId = quizId;
  }
}