export interface UserRequest {
  getById: (id: number) => Promise<any>;
}
