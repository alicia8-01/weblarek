import {
  IApi,
  IApiResponse,
  IProduct,
  IOrderData,
  IOrderResult,
} from "../../types";

export class ApiClient {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getItems(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IApiResponse<IProduct>>(`/product/`);
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении списка товаров:", error);
      throw error;
    }
  }

  async postOrder(orderData: IOrderData): Promise<IOrderResult> {
    try {
      const response = await this.api.post<IOrderResult>(`/order/`, orderData);
      return response;
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      throw error;
    }
  }
}
