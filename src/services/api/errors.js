// Backend error envelope: { success:false, message, errors } where errors is
// null or [{ field, message }] (validation).
export class ApiError extends Error {
  constructor({ message, status = 0, errors = null, isNetworkError = false }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = Array.isArray(errors) ? errors : null;
    this.isNetworkError = isNetworkError;
  }

  // { fieldName: 'message' } for mapping onto form inputs.
  get fieldErrors() {
    return (this.errors || []).reduce((acc, { field, message }) => {
      if (field && !(field in acc)) acc[field] = message;
      return acc;
    }, {});
  }
}

const NETWORK_MESSAGE = 'Unable to reach the server. Please check your connection and try again.';
const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

export const toApiError = (error) => {
  if (error instanceof ApiError) return error;

  const response = error?.response;
  if (!response) {
    return new ApiError({ message: NETWORK_MESSAGE, isNetworkError: true });
  }

  const body = response.data;
  const status = response.status;
  // 5xx messages can carry internal details (e.g. database errors); never show them.
  const message =
    status >= 500 || typeof body?.message !== 'string' || !body.message
      ? GENERIC_MESSAGE
      : body.message;

  return new ApiError({ message, status, errors: body?.errors });
};

export const getErrorMessage = (error) => toApiError(error).message;
