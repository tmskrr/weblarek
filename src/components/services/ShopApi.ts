import { IApi, IProductsResponse, IProduct, IOrderRequest, IOrderResponse } from '../../types/index';

export class ShopApi {
  // поле класса: будет объект, у которого есть методы get/post
  public http: IApi;

  constructor(http: IApi) {
    this.http = http;
  }

  // Получить товары: GET /product/
  async getProducts(): Promise<IProduct[]> {
    const url = '/product/';
    // запрашиваем у сервера список товаров
    const data: IProductsResponse = await this.http.get(url);
    // из ответа берем массив товаров
    const items: IProduct[] = data.items;
    return items;
  }

  // Создать заказ: POST /order/
  async createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    const url = '/order/';
    const body: IOrderRequest = payload;
    // отправляем на сервер данные заказа
    const result: IOrderResponse = await this.http.post(url, body);
    // возвращаем то, что ответил сервер
    return result;
  }
}