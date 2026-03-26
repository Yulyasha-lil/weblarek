import { IApi, IProduct, IOrder, IOrderResult, IProductsResponse } from "../../types/index";

/**
 * Класс для работы с API сервера
 * Использует композицию с базовым классом Api
 * Отвечает за бизнес-логику запросов к серверу
 */
export class AppApi {
  
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IProductsResponse>('/product');
      return response.items;
    } catch(error) {
      console.log('Возникли проблемы с сервером при получении товаров:', error);
      throw error;
    } 
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    try {
      const result = await this.api.post<IOrderResult>('/order', order);
      return result
    } catch(error) {
      console.log('Возникли проблемы с сервером при отправке заказа:', error);
      throw error;
    }
  }
}