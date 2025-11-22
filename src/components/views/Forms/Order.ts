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
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        // нажали способ оплаты
        this.paymentButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                this.events.emit("order:payment", { method: btn.name });
                this.payment = btn.name;
                this.validate();
            });
        });
    }

    // === ОБЯЗАТЕЛЬНЫЕ методы === //

    protected handleInput(field: keyof IOrder, value: string): void {
        // адрес всегда обновляется
        if (field === "address") {
            this.events.emit("order:address", { address: value });
        }
    
        // условия активации кнопки:
        // есть выбранный метод + непустой адрес
        const paymentSelected = Array.from(this.paymentButtons)
            .some(btn => btn.classList.contains("button_alt-active"));
    
        const valid = paymentSelected && this.addressInput.value.trim().length > 0;
        this.valid = valid;
    
        // ошибок нет — очищаем
        this.error = valid ? "" : "Заполните адрес и выберите оплату";
    }
    

    protected handleSubmit(): void {
        // валидация
        if (this.submitButton.disabled) return;
        this.events.emit("order:submit");
    }

    // === Валидация формы === //
    private validate() {
        const addressOk = this.addressInput.value.trim().length > 0;
        const paymentOk = [...this.paymentButtons].some(btn =>
            btn.classList.contains("button_alt-active")
        );

        if (!paymentOk) this.error = "Выберите способ оплаты";
        else if (!addressOk) this.error = "Введите адрес доставки";
        else this.error = "";

        this.valid = paymentOk && addressOk;
    }

    // === сеттеры для презентера === //

    set payment(method: string) {
        this.paymentButtons.forEach(btn => {
            btn.classList.toggle("button_alt-active", btn.name === method);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}