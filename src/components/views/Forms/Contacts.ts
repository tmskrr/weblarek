// Форма ввода контактных данных пользователя
// находит поля email и телефона
// находит кнопку submit
// отображает ошибки под формой
// разблокирует кнопку, если оба поля валидны
// генерирует событие 'contacts:submit' при успешной отправке
// не хранит данные — записывает их через презентер в BuyerModel

import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../../base/Events";

export interface IContacts {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container);

    // найти поля
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );
  }

  // обработчик submit из Form //
  protected handleSubmit(): void {
    this.events.emit("contacts:submit");
  }

  /** Обработчик input из Form */
  protected handleInput(field: keyof IContacts, value: string): void {
    if (field === "email") {
        this.events.emit("contacts:email", { email: value });
    }

    if (field === "phone") {
        this.events.emit("contacts:phone", { phone: value });
    }

    // условия валидности:
    const emailOk = this.emailInput.value.trim().length > 0;
    const phoneOk = this.phoneInput.value.trim().length > 0;

    const valid = emailOk && phoneOk;
    this.valid = valid;

    this.error = valid ? "" : "Заполните email и телефон";
}

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}