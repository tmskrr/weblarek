import { IBuyer, TPayment } from "../../types/index";

export class BuyerModel {
  // инициализация полей
  constructor() {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // поля данных покупателя
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;

  // сохранить часть данных
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  // получить весь набор данных
  getData(): Partial<IBuyer> {
    return {
      payment: this.payment || undefined,
      email: this.email || undefined,
      phone: this.phone || undefined,
      address: this.address || undefined,
    };
  }

  // очистить данные покупателя
  clear(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
}
