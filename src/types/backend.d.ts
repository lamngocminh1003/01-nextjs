export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

export declare global {
  export interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  export interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  export interface ILogin<T> {
    user: {
      _id: string;
      email: string;
      name: string;
    };
    accessToken: string;
  }
}
