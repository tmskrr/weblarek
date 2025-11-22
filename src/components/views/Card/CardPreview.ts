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
  protected productId: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
  }

  render(data: IProduct & { inCart: boolean }) {
    this.productId = data.id;
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
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    }
  }

  set inCart(value: boolean) {
    if (value) {
      this.buttonElement.textContent = "Удалить";
      this.buttonElement.classList.add("card__button_remove");
      this.buttonElement.onclick = () =>
        this.events.emit("product:remove", { id: this.productId });
    } else {
      this.buttonElement.textContent = "В корзину";
      this.buttonElement.classList.remove("card__button_remove");
      this.buttonElement.onclick = () =>
        this.events.emit("product:add", { id: this.productId });
    }
  }
}
