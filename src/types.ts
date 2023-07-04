export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: unknown;
    };

export type AsyncResult<T> = Promise<Result<T>>;
