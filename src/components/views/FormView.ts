import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class FormView<T> extends Component<T> {
  protected button: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container
    );
    this.errors = ensureElement<HTMLElement>(".form__errors", container);

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      if (!this.button.disabled) {
        this.events.emit(`${container.name}:submit`);
      }
    });
  }

  set formErrors(value: string) {
    this.setText(this.errors, value);
  }

  set valid(value: boolean) {
    this.button.disabled = !value;
  }

  render(data: T): HTMLElement {
    super.render(data);

    return this.container;
  }
}
