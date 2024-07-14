/**
 * Server Actionsの結果を表す型
 */
export type ActionResult<T> = {
  success: boolean;
  error?: string;
  result?: T;
};
