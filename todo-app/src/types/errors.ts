export type AppError =
  | { type: 'VALIDATION_ERROR'; message: string; field?: string }
  | { type: 'NOT_FOUND'; message: string; id: number }
  | { type: 'STORAGE_ERROR'; message: string };
