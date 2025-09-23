export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IApiResponse<T> {
  items: T[];
  total: number;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: "card" | "cash" | "";
  email: string;
  phone: string;
  address: string;
}

export interface IOrderData extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface ICatalogChangedEvent {
  items: IProduct[];
}

export interface IBasketChangedEvent extends ICatalogChangedEvent {
  count: number;
  total: number;
}

export interface ISelectedItemEvent {
  item: IProduct;
}
