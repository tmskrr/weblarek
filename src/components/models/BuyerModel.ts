import { IBuyer, TPayment, IValidationErrors } from '../../types/index';

export class BuyerModel {
  constructor() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  // поля с явными типами
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;

  // сохранить данные
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  // получить все данные
  getData(): Partial<IBuyer> {
    return {
      payment: this.payment || undefined,
      email: this.email || undefined,
      phone: this.phone || undefined,
      address: this.address || undefined,
    };
  }

  // очистить все данные
  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  // валидация
  validate(): IValidationErrors {
    const errors: IValidationErrors = {};
    if (!this.payment) errors.payment = 'Не выбран способ оплаты';
    if (!this.email) errors.email = 'Введите email';
    if (!this.phone) errors.phone = 'Введите телефон';
    if (!this.address) errors.address = 'Введите адрес';
    return errors;
  }
}