import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class ModalView extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );
    this.content = ensureElement<HTMLElement>(".modal__content", container);

    this.closeButton.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("click", this.close.bind(this));
    this.content.addEventListener("click", (event) => event.stopPropagation());
  }

  set modalContent(value: HTMLElement | null) {
    if (value) {
      this.content.replaceChildren(value);
    } else {
      this.content.innerHTML = "";
    }
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.modalContent = null;
    this.events.emit("modal:close");
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();

    return this.container;
  }
}
