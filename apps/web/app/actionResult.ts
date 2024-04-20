export type ActionResult<T> = {
  success: boolean;
  error?: string;
  result?: T;
};
