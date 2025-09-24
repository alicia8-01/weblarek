import { ICard, CardView } from "./CardView";
import { ensureElement } from "../../../utils/utils";

interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

interface ICardPreviewData extends ICard {
  isInBasket?: boolean;
  hasPrice?: boolean;
}

export class CardPreview extends CardView<ICardPreviewData> {
  protected description: HTMLElement;
  protected button: HTMLButtonElement;
  protected isInBasket: boolean = false;
  protected hasPrice: boolean = true;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.description = ensureElement<HTMLElement>(".card__text", container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (action?.onClick) {
      this.button.addEventListener("click", action.onClick);
    }
  }

  set cardDescription(value: string) {
    this.setText(this.description, value);
  }

  set buttonText(value: string) {
    this.setText(this.button, value);
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }

  set checkIsInBasket(value: boolean) {
    this.isInBasket = value;
    this.updateState();
  }

  set checkHasPrice(value: boolean) {
    this.hasPrice = value;
    this.updateState();
  }

  private updateState(): void {
    if (!this.hasPrice) {
      this.buttonText = "Недоступно";
      this.buttonDisabled = true;
    } else if (this.isInBasket) {
      this.buttonText = "Удалить из корзины";
      this.buttonDisabled = false;
    } else {
      this.buttonText = "Купить";
      this.buttonDisabled = false;
    }
  }

  render(data: ICardPreviewData): HTMLElement {
    if (data.title !== undefined) this.cardTitle = data.title;
    if (data.image !== undefined) this.cardImage = data.image;
    if (data.category !== undefined) this.cardCategory = data.category;
    if (data.price !== undefined) this.cardPrice = data.price;

    super.render(data);

    if (data.isInBasket !== undefined) {
      this.isInBasket = data.isInBasket;
    }
    if (data.hasPrice !== undefined) {
      this.hasPrice = data.hasPrice;
    }

    if (data.description) {
      this.cardDescription = data.description;
    }

    this.updateState();

    return this.container;
  }
}
