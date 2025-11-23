/* Сергей, спасибо большое за ваши комментарии!
Постаралась учесть.
*/

import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { Events } from "./components/base/Events";

import { ShopApi } from "./components/services/ShopApi";
import { API_URL } from "./utils/constants";

import { Basket } from "./components/views/Basket";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Success } from "./components/views/Success";

import { CardCatalog } from "./components/views/Card/CardCatalog";
import { CardPreview } from "./components/views/Card/CardPreview";
import { CardBasket } from "./components/views/Card/CardBasket";

import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Order } from "./components/views/Forms/Order";
import { Contacts } from "./components/views/Forms/Contacts";

import { cloneTemplate, ensureElement } from "./utils/utils";

const events = new Events();

// модели
const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

// api
const http = new Api(API_URL, {
  headers: { "Content-Type": "application/json" },
});
const api = new ShopApi(http);

// view
const header = new Header(events, ensureElement(".header"));
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(events, ensureElement("#modal-container"));

// шаблоны
const tplCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

// запрос на закрытие модалки
events.on("modal:request-close", () => {
  modal.close();
});

// каталог
events.on("catalog:changed", ({ items }) => {
  const cards = items.map((product) => {
    const node = cloneTemplate(tplCatalog);
    const card = new CardCatalog(node, {
      onClick: () => catalog.setPreview(product.id),
    });
    return card.render(product);
  });

  gallery.items = cards;
});

// открыть превью
events.on("catalog:preview", () => {
  const product = catalog.getPreview();
  if (!product) return;

  const node = cloneTemplate(tplPreview);
  const card = new CardPreview(node, events);

  const inCart = cart.getItems().some((p) => p.id === product.id);

  modal.content = card.render({
    ...product,
    inCart,
  });

  modal.open();
});

// корзина
events.on("cart:changed", () => {
  header.counter = cart.getCount();

  // если корзина открыта → обновить
  const basketEl = modal.container.querySelector(".basket");
  if (!basketEl) return;

  const basket = new Basket(basketEl, events);
  renderBasket(basket);
});

// открыть корзину
events.on("basket:open", () => {
  const node = cloneTemplate(tplBasket);
  const basket = new Basket(node, events);

  modal.content = basket.render({});
  modal.open();

  renderBasket(basket);
});

// действие из превью
events.on("product:add", ({ id }) => {
  const product = catalog.getById(id);
  if (product) cart.add(product);
  modal.close();
});

events.on("product:remove", ({ id }) => {
  cart.remove(id);
  modal.close();
});

// удалить из корзины
events.on("cart:item:remove", ({ id }) => {
  cart.remove(id);
});

// оформление
events.on("cart:checkout", () => {
  const node = cloneTemplate(tplOrder);
  const order = new Order(node, events);
  modal.content = order.render({});
});

// выбор способа оплаты
events.on("order:payment", ({ method }) => {
  buyer.setData({ payment: method });
});

// ввод адреса
events.on("order:address", ({ address }) => {
  buyer.setData({ address });
});

// Order → Contacts
events.on("order:submit", () => {
  const node = cloneTemplate(tplContacts);
  const contacts = new Contacts(node, events);
  modal.content = contacts.render({});
});

// ввод email/phone → передаём в buyer
events.on("contacts:email", ({ email }) => buyer.setData({ email }));
events.on("contacts:phone", ({ phone }) => buyer.setData({ phone }));

// buyer поменялся → обновляем форму
events.on("buyer:changed", () => {
  const errors = buyer.validate();
  const isValid = !errors.email && !errors.phone;

  const formEl = modal.container.querySelector("form[name='contacts']");
  if (formEl) {
    const contacts = new Contacts(formEl as HTMLFormElement, events);
    contacts.valid = isValid;
    contacts.error = isValid ? "" : "Заполните email и телефон";
  }
});
// submit Contacts → заказ
events.on("contacts:submit", () => {
  const data = {
    ...buyer.getData(),
    total: cart.getTotal(),
    items: cart.getItems().map((item) => item.id),
  };

  api.createOrder(data).then((result) => {
    cart.clear();
    buyer.clear();

    const node = cloneTemplate(tplSuccess);
    const success = new Success(node, events);
    success.description = `Списано ${result.total} синапсов`;

    modal.content = success.render({});
  });
});

// закрыть success
events.on("success:close", () => modal.close());

// рендер корзины
function renderBasket(basket: Basket) {
  const items = cart.getItems();

  const cards = items.map((product, index) => {
    const node = cloneTemplate(tplBasketItem);
    const card = new CardBasket(node, events);
    return card.render({ ...product, index: index + 1 });
  });

  basket.items = cards;
  basket.total = cart.getTotal();
  basket.empty = cards.length === 0;
}

// запускаем
api.getProducts().then((list) => catalog.setProducts(list));
