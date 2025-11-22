import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private products: IProduct[] = [];
  private previewId?: string;

  constructor(private events: IEvents) {}

  // сохранить массив
  setProducts(items: IProduct[]): void {
    this.products = items;
    // уведомить презентер, что каталог обновился
    this.events.emit("catalog:changed", { items });
  }

  // отдать весь массив
  getProducts(): IProduct[] {
    return this.products;
  }

  // найти по id
  getById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  // сохранить id выбранного товара (или снять выбор)
  setPreview(id?: string): void {
    this.previewId = id;
    // уведомить презентер (открыть/закрыть превью)
    this.events.emit("catalog:preview", { id });
  }

  // получить выбранный товар (или undefined)
  getPreview(): IProduct | undefined {
    return this.previewId ? this.getById(this.previewId) : undefined;
  }
}
