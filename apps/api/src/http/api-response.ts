export interface ApiResponseMeta {
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiSuccessResponse<TData> {
  readonly ok: true;
  readonly data: TData;
  readonly meta: ApiResponseMeta;
}

export interface ApiFailureResponse<TError> {
  readonly ok: false;
  readonly error: TError;
  readonly meta: ApiResponseMeta;
}

export type ApiResponse<TData, TError> = ApiSuccessResponse<TData> | ApiFailureResponse<TError>;

export function createApiSuccessResponse<TData>(data: TData, meta: ApiResponseMeta): ApiSuccessResponse<TData> {
  return {
    ok: true,
    data,
    meta
  };
}

export function createApiFailureResponse<TError>(error: TError, meta: ApiResponseMeta): ApiFailureResponse<TError> {
  return {
    ok: false,
    error,
    meta
  };
}
