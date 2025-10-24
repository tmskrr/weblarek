import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';           // базовый класс из стартера
import { ShopApi } from './components/services/ShopApi';
import { API_URL } from './utils/constants';           // базовый адрес API

// CatalogModel
const catalog = new CatalogModel();
catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());

const first = apiProducts.items[0];
if (first) {
  console.log('Товар по id:', catalog.getById(first.id));
  catalog.setPreview(first.id);
  console.log('Товар для предпросмотра:', catalog.getPreview());
}

// CartModel
const cart = new CartModel();
if (first) cart.add(first);
const second = apiProducts.items[1];
if (second) cart.add(second);

console.log('Товары в корзине:', cart.getItems());
console.log('Количество товаров в корзине:', cart.getCount());
console.log('Итоговая сумма корзины:', cart.getTotal());

if (first) {
  cart.remove(first.id);
  console.log('После удаления первого товара:', cart.getItems());
}

cart.clear();
console.log('После очистки корзины:', cart.getItems());

// BuyerModel
const buyer = new BuyerModel();
console.log('Проверка на пустых данных:', buyer.validate());

buyer.setData({ payment: 'card' });
buyer.setData({ address: 'Пример, ул. Ленина, 1' });
buyer.setData({ email: 'you@example.com' });
buyer.setData({ phone: '+7 900 000 00 00' });

console.log('Проверка после заполнения:', buyer.validate());
console.log('Данные покупателя:', buyer.getData());

buyer.clear();
console.log('После очистки покупателя:', buyer.getData(), buyer.validate());

//СЛОЙ КОММУНИКАЦИИ 
// http-клиент и сервис
const http = new Api(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});
const shopApi = new ShopApi(http);

// получаем каталог с сервера и сохраняем в модель
shopApi
  .getProducts()
  .then((list) => {
    catalog.setProducts(list);
    console.log('Каталог с сервера:', catalog.getProducts());
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога:', err);
  });