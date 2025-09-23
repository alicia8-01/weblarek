import { ICard, CardView } from "./CardView";

interface ICardAction {
  onClick: () => void;
}

export class CardCatalogView extends CardView<ICard> {
  constructor(container: HTMLElement, protected action?: ICardAction) {
    super(container);

    if (action?.onClick) {
      this.container.addEventListener("click", action.onClick);
    }
  }
}
