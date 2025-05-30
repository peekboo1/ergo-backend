export interface IResponse<T> {
  error: boolean;
  message: string;
  data: T | null;
  statusCode?: number;
}
