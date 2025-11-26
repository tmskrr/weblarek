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

// шаблоны
const tplCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

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

const basket = new Basket(cloneTemplate(tplBasket), events);
const order = new Order(cloneTemplate(tplOrder), events);
const contacts = new Contacts(cloneTemplate(tplContacts), events);
const success = new Success(cloneTemplate(tplSuccess), events);

// запрос на закрытие модалки
events.on("modal:request-close", () => {
  modal.close();
});

// каталог
events.on("catalog:changed", ({ items }) => {
  const cards = items.map((product) => {
    const node = cloneTemplate(tplCatalog);

    const card = new CardCatalog(node, {
      onClick: () => events.emit("card:selected", { id: product.id }),
    });

    return card.render(product);
  });

  gallery.items = cards;
});

events.on("card:selected", ({ id }) => {
  catalog.setPreview(id);
});

// превью
events.on("catalog:preview", () => {
  const product = catalog.getPreview();
  if (!product) return;

  const node = cloneTemplate(tplPreview);

  const inCart = cart.getItems().some((p) => p.id === product.id);

  const card = new CardPreview(node, {
    onClick: () => events.emit("preview:action", { id: product.id }),
  });

  // устанавливаем данные
  modal.content = card.render({
    ...product,
    inCart,
    buttonText:
      product.price === null ? "Недоступно" : inCart ? "Удалить" : "В корзину",
    buttonDisabled: product.price === null,
  });

  modal.open();
});

// действие из превью (добавить/удалить)
events.on("preview:action", ({ id }) => {
  const product = catalog.getById(id);
  if (!product) return;

  const inCart = cart.getItems().some((item) => item.id === id);

  if (inCart) {
    cart.remove(id);
  } else {
    cart.add(product);
  }

  modal.close();
});

// корзина
events.on("cart:changed", () => {
  header.counter = cart.getCount();
  renderBasket();
});

events.on("basket:open", () => {
  modal.content = basket.render({});
  modal.open();
});

events.on("cart:item:remove", ({ id }) => {
  cart.remove(id);
});

// оформление
events.on("cart:checkout", () => {
  modal.content = order.render({});
  modal.open();
});

// выбор способа оплаты
events.on("order:payment", ({ field, value }) => {
  buyer.setData({ [field]: value });
});

// ввод адреса
events.on("order:address", ({ field, value }) => {
  buyer.setData({ [field]: value });
});

// Order → Contacts
events.on("order:submit", () => {
  modal.content = contacts.render({});
});

// ввод email/phone → передаём в buyer
events.on("contacts:email", ({ email }) => buyer.setData({ email }));
events.on("contacts:phone", ({ phone }) => buyer.setData({ phone }));

// buyer поменялся → обновляем форму
events.on("buyer:changed", () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  // Order
  order.render({
    payment: data.payment ?? "",
    address: data.address ?? "",
    error:
      data.payment || data.address
        ? errors.payment || errors.address || ""
        : "",
    valid: !errors.payment && !errors.address,
  });

  // Contacts
  contacts.render({
    email: data.email ?? "",
    phone: data.phone ?? "",
    error: data.email || data.phone ? errors.email || errors.phone || "" : "",
    valid: !errors.email && !errors.phone,
  });
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

    modal.content = success.render({
      description: `Списано ${result.total} синапсов`,
    });

    modal.open();
  });
});

// закрыть success
events.on("success:close", () => modal.close());

// рендер корзины
function renderBasket() {
  const items = cart.getItems();

  const cards = items.map((product, index) => {
    const node = cloneTemplate(tplBasketItem);
    const card = new CardBasket(node, {
      onDelete: () => events.emit("cart:item:remove", { id: product.id }),
    });
    return card.render({ ...product, index: index + 1 });
  });

  basket.items = cards;
  basket.total = cart.getTotal();
  basket.empty = cards.length === 0;
}

// запускаем
api
  .getProducts()
  .then((list) => {
    catalog.setProducts(list);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
