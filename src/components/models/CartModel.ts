import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class CartModel {
  // товары в корзине
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  add(product: IProduct): void {
    const existing = this.items.find(item => item.id === product.id);
    if (!existing) {
      this.items.push(product);
      this.events.emit("cart:changed");
    }
  }
  
  remove(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.events.emit("cart:changed");
  }
  
  clear(): void {
    this.items = [];
    this.events.emit("cart:changed");
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
      if (typeof item.price === "number") {
        total += item.price;
      }
    }
    return total;
  }
}
