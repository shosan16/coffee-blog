export type ErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};
