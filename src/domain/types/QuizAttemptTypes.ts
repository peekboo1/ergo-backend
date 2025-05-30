export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface UserAnswer {
  option?: Option;
}

export interface Quiz {
  id: string;
  title: string;
}

export interface Attempt {
  id: string;
  quiz?: Quiz;
  answers?: UserAnswer[];
  createdAt: string;
}
