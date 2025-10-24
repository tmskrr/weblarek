import { IProduct } from '../../types';

export class CatalogModel {
  private products: IProduct[] = [];
  private previewId?: string;

  // сохранить массив
  setProducts(items: IProduct[]): void {
    this.products = items;
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
  }

  // получить выбранный товар (или undefined)
  getPreview(): IProduct | undefined {
    return this.previewId ? this.getById(this.previewId) : undefined;
  }
}