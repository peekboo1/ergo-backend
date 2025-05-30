export class Option {
  public id!: string;
  public text!: string;
  public isCorrect!: boolean;
  public questionId!: string;

  constructor(
    id: string,
    text: string, 
    isCorrect: boolean,
    questionId: string
  ) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
    this.questionId = questionId;
  }
}
