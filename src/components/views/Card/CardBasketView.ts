import { ICard, CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";

interface ICardBasket extends ICard {
  index: number;
}

interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

export class CardBasketView extends CardView<ICardBasket> {
  protected index: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);
    this.index = ensureElement<HTMLElement>(".basket__item-index", container);
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    if (action?.onClick) {
      this.button.addEventListener("click", action.onClick);
    }
  }

  set itemIndex(value: number) {
    this.setText(this.index, value.toString());
  }
}
