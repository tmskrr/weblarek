// Карточка товара в модальном окне
// отображает полное описание товара
// находит элементы: изображение, категория, текст, кнопка действия
// показывает кнопку «Купить» или «Удалить» в зависимости от состояния
// если товара нет в корзине → генерирует 'product:add'
// если товар уже в корзине → генерирует 'product:remove'
// если нет цены → кнопка блокируется и пишет «Недоступно»

import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  protected productId = "";
  protected isInCart = false;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    this.imageElement = ensureElement(".card__image", this.container);
    this.categoryElement = ensureElement(".card__category", this.container);
    this.descriptionElement = ensureElement(".card__text", this.container);
    this.buttonElement = ensureElement(".card__button", this.container);

    this.buttonElement.addEventListener("click", () => {
      if (this.buttonElement.disabled) return;

      this.events.emit(this.isInCart ? "product:remove" : "product:add", {
        id: this.productId,
      });
    });
  }

  render(data: IProduct & { inCart: boolean }) {
    this.productId = data.id;
    this.isInCart = data.inCart;

    return super.render(data);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      // полностью недоступный товар
      this.priceElement.textContent = "Бесценно";
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
      this.buttonElement.classList.add("button_disabled");
      return;
    }

    // обычный товар
    this.priceElement.textContent = `${value} синапсов`;
    this.buttonElement.disabled = false;
    this.buttonElement.classList.remove("button_disabled");
    this.buttonElement.textContent = this.isInCart ? "Удалить" : "В корзину";
  }

  set inCart(value: boolean) {
    this.isInCart = value;

    if (!this.buttonElement.disabled) {
      this.buttonElement.textContent = value ? "Удалить" : "В корзину";
    }
  }
}
