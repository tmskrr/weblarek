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

  // обработчик submit из Form
  protected handleSubmit(): void {
    this.events.emit("contacts:submit");
  }

  // обработчик input из Form
  protected handleInput(field: keyof IContacts, value: string) {
    this.events.emit(`contacts:${field}`, { [field]: value });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
