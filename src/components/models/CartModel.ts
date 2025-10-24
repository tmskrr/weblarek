import { IProduct } from '../../types/index';

export class CartModel {
  constructor() {
    this.items = [];
  }

  // товары в корзине
  items;

  // добавить товар
  add(product) {
    const existing = this.items.find((item) => item.id === product.id);
    if (!existing) {
      this.items.push(product);
    }
  }

  // удалить товар
  remove(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  // очистить корзину
  clear() {
    this.items = [];
  }

  // получить все товары
  getItems() {
    return this.items;
  }

  // получить количество товаров
  getCount() {
    return this.items.length;
  }

  // посчитать общую сумму
  getTotal() {
    let total = 0;
    for (const item of this.items) {
      if (item.price) {
        total += item.price;
      }
    }
    return total;
  }
}