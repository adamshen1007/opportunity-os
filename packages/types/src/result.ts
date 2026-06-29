export type Success<Value> = {
  readonly ok: true;
  readonly value: Value;
};

export type Failure<ErrorValue> = {
  readonly ok: false;
  readonly error: ErrorValue;
};

export type Result<Value, ErrorValue> = Success<Value> | Failure<ErrorValue>;
