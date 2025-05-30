export class QuizAttempt {
  public id!: string;
  public quizId!: string;
  public userId!: string;
  public score?: number;

  constructor(id: string, quizId: string, userId: string, score?: number) {
    this.id = id;
    this.quizId = quizId;
    this.userId = userId;
    this.score = score;
  }
}
