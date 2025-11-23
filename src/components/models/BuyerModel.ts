import { IBuyer, TPayment, IValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class BuyerModel {
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;

  constructor(private events: IEvents) {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  // сохранить часть данных
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;

    this.events.emit("buyer:changed", this.getData());
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

    this.events.emit("buyer:changed", this.getData());
  }

  // валидация

  validate(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this.payment) errors.payment = "Не выбран способ оплаты";
    if (!this.address) errors.address = "Введите адрес";
    if (!this.email) errors.email = "Введите email";
    if (!this.phone) errors.phone = "Введите телефон";

    return errors;
  }
}
