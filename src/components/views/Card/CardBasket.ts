// Карточка товара внутри корзины
// отображает порядковый номер, название, цену
// содержит кнопку удаления товара
// при нажатии генерирует событие 'cart:item:remove'
// отображает данные, полученные от модели (через презентер)

import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

export class CardBasket extends Card<IProduct> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: { onDelete?: () => void }
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    if (actions?.onDelete) {
      this.deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}