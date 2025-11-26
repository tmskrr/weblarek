// Карточка товара в модальном окне
// отображает полное описание товара
// находит элементы: изображение, категория, текст, кнопка действия
// показывает кнопку «Купить» или «Удалить» в зависимости от состояния

import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";

type CategoryKey = keyof typeof categoryMap;

interface ICardPreviewActions {
  onClick?: () => void;
}

export class CardPreview extends Card<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected actions: ICardPreviewActions = {}
  ) {
    super(container);

    this.imageElement = ensureElement(".card__image", container);
    this.categoryElement = ensureElement(".card__category", container);
    this.descriptionElement = ensureElement(".card__text", container);
    this.buttonElement = ensureElement(".card__button", container);

    this.buttonElement.addEventListener("click", () => {
      this.actions.onClick?.();
    });
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

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
    this.buttonElement.classList.toggle("button_disabled", value);
  }
}
