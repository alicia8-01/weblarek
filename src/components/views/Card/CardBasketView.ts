import { ICard, CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";

interface ICardBasket extends ICard {
  index: number;
}

interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

export class CardBasketView extends CardView<ICardBasket> {
  protected indexElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    if (action?.onClick) {
      this.button.addEventListener("click", action.onClick);
    }
  }

  set itemIndex(value: number) {
    this.setText(this.indexElement, value.toString());
  }

  render(data: ICardBasket): HTMLElement {
    if (data.title !== undefined) this.cardTitle = data.title;
    if (data.price !== undefined) this.cardPrice = data.price;
    if (data.category !== undefined) this.cardCategory = data.category;
    if (data.image !== undefined) this.cardImage = data.image;

    this.itemIndex = data.index;

    return this.container;
  }
}
