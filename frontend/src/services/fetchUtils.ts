import { UnauthorizedError, ConflictError } from '../errors/http_errors';

export async function fetchData(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw new Error(errorMessage);
    }
  }
  return response;
}
