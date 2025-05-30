export class UserAnswer {
  public id!: string;
  public attemptId!: string;
  public userId!: string;
  public selectedOptionId!: string;
  public isCorrect?: boolean;
  // public option?: string;

  constructor(
    id: string,
    attemptId: string,
    userId: string,
    selectedOptionId: string,
    isCorrect?: boolean
    // option?: string
  ) {
    this.id = id;
    this.attemptId = attemptId;
    this.userId = userId;
    this.selectedOptionId = selectedOptionId;
    this.isCorrect = isCorrect;
    // this.option = option;
  }
}
