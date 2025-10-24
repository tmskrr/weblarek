import { IProduct } from '../../types/index';

export class CatalogModel {
  constructor() {
    this.products = [];
    this.previewProduct = null;
  }

  // массив всех товаров
  products;

  // выбранный товар для просмотра
  previewProduct;

  // сохранить товары
  setProducts(items) {
    this.products = items;
  }

  // получить все товары
  getProducts() {
    return this.products;
  }

  // получить товар по id
  getById(id) {
    return this.products.find((item) => item.id === id);
  }

  // установить выбранный товар
  setPreview(id) {
    this.previewProduct = this.getById(id);
  }

  // получить выбранный товар
  getPreview() {
    return this.previewProduct;
  }
}