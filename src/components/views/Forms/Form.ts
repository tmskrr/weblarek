// Базовый класс формы
// находит кнопку submit и контейнер для ошибок
// содержит обработчик изменения инпутов (например input или change)
// вызывает переданный actions.onSubmit при отправке формы
// показывает текст ошибок
// блокирует кнопку submit, если есть ошибки или данные невалидны
// не хранит данные формы — данные только в модели BuyerModel
// дочерние классы (Order, Contacts) только передают id полей и типы действий

import { Component } from "../../base/Component";

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(protected readonly form: HTMLFormElement) {
        super(form);

        // найти кнопку submit
        this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;

        // найти элемент ошибок
        this.errorElement = this.form.querySelector(".form__errors") as HTMLElement;

        // обработчик submit
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.handleSubmit();
        });

        // обработчик input
        this.form.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            if (!target.name) return;

            // поле
            const field = target.name as keyof T;
            const value = target.value;

            this.handleInput(field, value);
        });
    }

    // абстрактные методы
    protected abstract handleSubmit(): void;
    protected abstract handleInput(field: keyof T, value: string): void;

    // вывод ошибки
    set error(message: string) {
        this.errorElement.textContent = message;
    }

    // активация submit
    set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.form;
    }
}