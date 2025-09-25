import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export type ModalContentType =
  | "preview"
  | "basket"
  | "order"
  | "contacts"
  | "success"
  | null;

export class ModalView extends Component<IModalData> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected currentContentType: ModalContentType = null;

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

  setContent(content: HTMLElement, contentType: ModalContentType): void {
    this.modalContent = content;
    this.currentContentType = contentType;
    this.events.emit("modal:contentChanged", { type: contentType });
  }

  getCurrentContentType(): ModalContentType {
    return this.currentContentType;
  }

  open(contentType?: ModalContentType): void {
    this.container.classList.add("modal_active");
    if (contentType) {
      this.currentContentType = contentType;
    }
    this.events.emit("modal:open", { type: this.currentContentType });
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.modalContent = null;
    this.currentContentType = null;
    this.events.emit("modal:close");
  }

  render(data: IModalData): HTMLElement {
    super.render(data);

    this.open();

    return this.container;
  }
}
