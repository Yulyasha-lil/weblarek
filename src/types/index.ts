export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

type TPayment = 'online' | 'cash'

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера при получении списка товаров
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

// Данные для отправки заказа (расширяем IBuyer)
export interface IOrder extends IBuyer {
  items: string[]; // массив id товаров
}

// Ответ сервера после отправки заказа
export interface IOrderResult {
  id: string; // идентификатор заказа
  total: number; // итоговая сумма
}