// Базовый класс карточки
// находит элементы заголовка и цены
// предоставляет сеттеры title и price
// отвечает за базовое отображение данных карточки
// не содержит логики покупки или удаления
// не вызывает события
// используется всеми типами карточек

import { Component } from "../../base/Component";
import { IProduct } from "../../../types";

// родительский класс карточек
export class Card<T extends Partial<IProduct>> extends Component<T> {
  protected titleElement?: HTMLElement;
  protected priceElement?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // находим только то, что есть во всех карточках
    this.titleElement = container.querySelector(".card__title") || undefined;
    this.priceElement = container.querySelector(".card__price") || undefined;
  }

  // установка заголовка
  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  // установка цены
  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent = value === null ? "" : `${value} синапсов`;
    }
  }

  // метод вставки изображения
  protected setImage(img: HTMLImageElement, src: string, alt?: string) {
    img.src = src;
    if (alt) img.alt = alt;
  }

  // общий render для всех карточек
  render(data: Partial<T>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
