import { IProduct } from '../../types/index';

export class CartModel {
  // товары в корзине
  private items: IProduct[] = [];

  // добавить товар
  add(product: IProduct): void {
    const existing = this.items.find((item) => item.id === product.id);
    if (!existing) {
      this.items.push(product);
    }
  }

  // удалить товар
  remove(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  // очистить корзину
  clear(): void {
    this.items = [];
  }

  // получить все товары
  getItems(): IProduct[] {
    return this.items;
  }

  // получить количество товаров
  getCount(): number {
    return this.items.length;
  }

  // посчитать общую сумму
  getTotal(): number {
    let total = 0;
    for (const item of this.items) {
      if (typeof item.price === 'number') {
        total += item.price;
      }
    }
    return total;
  }
}