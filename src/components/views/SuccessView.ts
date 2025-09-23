import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number;
}

interface ISuccessAction {
  onClick: () => void;
}

export class SuccessView extends Component<ISuccess> {
  protected close: HTMLElement;
  protected total: HTMLElement;

  constructor(container: HTMLElement, action: ISuccessAction) {
    super(container);

    this.close = ensureElement<HTMLElement>(
      ".order-success__close",
      this.container
    );
    this.total = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    if (action?.onClick) {
      this.close.addEventListener("click", action.onClick);
    }
  }

  set countTotal(value: number) {
    this.setText(this.total, `Списано ${value} синапсов`);
  }
}
