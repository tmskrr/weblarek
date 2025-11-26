// Форма выбора способа оплаты и ввода адреса доставки
// находит кнопки оплаты: «Онлайн» и «При получении»
// находит поле адреса
// отмечает выбранный способ оплаты через модификатор 'button_alt-active'
// показывает ошибку, если адрес не заполнен или способ оплаты не выбран
// генерирует событие 'order:submit', когда форма валидна
// не выполняет проверку — валидация происходит в модели BuyerModel

import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IOrder {
  payment: string;
  address: string;
}

export class Order extends Form<IOrder> {
  protected paymentButtons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container);

    this.paymentButtons = container.querySelectorAll(".button_alt");
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    // выбор способа оплаты
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.events.emit("order:payment", {
          field: "payment",
          value: btn.name,
        });
      });
    });
  }

  // обработка ввода
  protected handleInput(field: keyof IOrder, value: string): void {
    this.events.emit("order:address", {
      field,
      value,
    });
  }

  // пользователь нажал оформить
  protected handleSubmit(): void {
    this.events.emit("order:submit");
  }

  // сеттеры для отображения — презентер вызовет render()
  set payment(method: string) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === method);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set error(value: string) {
    super.error = value;
  }

  set valid(value: boolean) {
    super.valid = value;
  }
}
