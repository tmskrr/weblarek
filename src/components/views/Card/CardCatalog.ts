// карточка в каталоге
// отображает картинку, категорию, цену, название
// находит элементы изображения и категории
// при клике вызывает actions.onClick (если передан)
// категорию оформляет через categoryMap (цветовые модификаторы)
// сообщает презентеру, что пользователь выбрал товар

import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";

type CategoryKey = keyof typeof categoryMap;

interface ICardCatalogActions {
  onClick?: () => void;
}

export class CardCatalog extends Card<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected actions: ICardCatalogActions
  ) {
    super(container);

    // элементы каталога
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container
    );

    // клик по всей карточке
    this.container.addEventListener("click", () => {
      this.actions.onClick?.();
    });
  }

  // картинка
  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title);
  }

  // категория + её цвет по categoryMap
  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}
