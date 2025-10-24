import { IBuyer } from '../../types/index';

export class BuyerModel {
    constructor() {
      this.payment = '';
      this.email = '';
      this.phone = '';
      this.address = '';
    }
  
    payment;
    email;
    phone;
    address;
  
    // сохранить данные 
    setData(data) {
      if (data.payment !== undefined) this.payment = data.payment;
      if (data.email !== undefined) this.email = data.email;
      if (data.phone !== undefined) this.phone = data.phone;
      if (data.address !== undefined) this.address = data.address;
    }
  
    // получить все данные
    getData() {
      return {
        payment: this.payment,
        email: this.email,
        phone: this.phone,
        address: this.address,
      };
    }
  
    // очистить все данные
    clear() {
      this.payment = '';
      this.email = '';
      this.phone = '';
      this.address = '';
    }
  
    // валидация
    validate() {
      const errors = {};
      if (!this.payment) errors.payment = 'Не выбран способ оплаты';
      if (!this.email) errors.email = 'Введите email';
      if (!this.phone) errors.phone = 'Введите телефон';
      if (!this.address) errors.address = 'Введите адрес';
      return errors;
    }
  }