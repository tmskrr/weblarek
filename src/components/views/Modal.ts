// Компонент модального окна
// не имеет дочерних классов, только один общий компонент
// находит кнопку закрытия и контейнер для содержимого
// при установке content вставляет в разметку любой компонент (CardPreview, Basket, Order, Contacts, Success)
// генерирует событие 'modal:close' при нажатии на кнопку крестика
// включает и выключает модальное окно через класс 'modal_active'
// не принимает решений о том, какое содержимое показывать — этим управляет презентер

import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  public current: string | null = null;

  constructor(
    protected events: IEvents,
    container: HTMLElement
  ) {
    super(container);

    this.events = events;

    // находим кнопку закрытия модального окна
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    // контейнер, в который вставляется содержимое модалки
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    // клик по крестику → закрываем модалку
    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    // клик по фону → закрываем модалку
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  // открыть модалку
  open(type?: string) {
    this.current = type ?? null;
    this.container.classList.add("modal_active");
  }

  // закрыть модалку
  close() {
    this.current = null;
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }
}
