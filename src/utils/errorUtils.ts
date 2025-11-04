// Utility type guard for error objects with a message property
export function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as any).message === 'string'
  );
}
