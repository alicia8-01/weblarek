import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormView } from "./FormView";

interface IContacts {
  email: string;
  phone: string;
  errors: string;
  valid: boolean;
}

export class ContactsView extends FormView<IContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );

    this.emailInput.addEventListener("input", () => {
      this.email = this.emailInput.value;
      events.emit("contacts.email:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.phone = this.phoneInput.value;
      events.emit("contacts.phone:change", {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  render(data: IContacts): HTMLElement {
    super.render(data);

    this.email = data.email;
    this.phone = data.phone;
    this.formErrors = data.errors;
    this.valid = data.valid;

    return this.container;
  }
}
