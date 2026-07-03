export interface ApiHealthDto {
  readonly status: "ok";
  readonly serviceName: string;
  readonly version: string;
  readonly checkedAt: string;
}
