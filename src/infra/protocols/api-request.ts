export interface ApiRequest {
  get: (url: string, headers: any) => Promise<any>;
}
