import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormView } from "./FormView";

interface IOrder {
  payment: string;
  address: string;
  errors: string;
}

export class OrderView extends FormView<IOrder> {
  protected payButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.payButtons = Array.from(container.querySelectorAll("button[name]"));
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this.errors = ensureElement<HTMLElement>(".form__errors", container);

    this.payButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.payment = button.name;
        events.emit("order.payment:change", { payment: button.name });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.address = this.addressInput.value;
      events.emit("order.address:change", {
        address: this.addressInput.value,
        validate: true,
      });
    });
  }

  set payment(value: string) {
    this.payButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set orderErrors(value: string) {
    this.setText(this.errors, value);
  }

  render(data: IOrder): HTMLElement {
    super.render(data);

    this.payment = data.payment;
    this.address = data.address;
    this.orderErrors = data.errors || "";

    return this.container;
  }

  protected update(_data: Partial<IOrder>): void {
    if (_data.payment !== undefined) this.payment = _data.payment;
    if (_data.address !== undefined) this.address = _data.address;
    if (_data.errors !== undefined) this.orderErrors = _data.errors;
  }
}
