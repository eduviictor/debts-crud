export interface RequestUserById {
  getById: (id: number) => Promise<any>;
}
