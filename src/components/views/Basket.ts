// Компонент Basket — содержимое модального окна корзины.
// - принимает массив карточек CardBasket и итоговую сумму
// - показывает список товаров или текст «Корзина пуста»
// - блокирует кнопку «Оформить», если корзина пустая
// - генерирует событие 'cart:checkout' при нажатии на кнопку
//
// Компонент ничего не знает о логике корзины — он только отображает данные.

import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected totalElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    // список товаров
    this.listElement = ensureElement(".basket__list", container);

    // кнопка оформить
    this.buttonElement = ensureElement(".basket__button", container);

    // итоговая цена
    this.totalElement = ensureElement(".basket__price", container);

    // обработчик кнопки
    this.buttonElement.addEventListener("click", () => {
      this.events.emit("cart:checkout");
    });
  }

  // массив карточек корзины
  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  // итоговая стоимость
  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set empty(isEmpty: boolean) {
    if (isEmpty) {
      this.listElement.innerHTML = "<p>Корзина пуста</p>";
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
    }
  }
}
