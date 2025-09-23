import { Component } from "../../base/Component";
import { ensureElementOrNull } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
}

export class CardView<T> extends Component<T> {
  protected title: HTMLElement | null;
  protected image: HTMLImageElement | null;
  protected category: HTMLElement | null;
  protected price: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this.title = ensureElementOrNull<HTMLElement>(".card__title", container);
    this.image = ensureElementOrNull<HTMLImageElement>(
      ".card__image",
      container
    );
    this.category = ensureElementOrNull<HTMLElement>(
      ".card__category",
      container
    );
    this.price = ensureElementOrNull<HTMLElement>(".card__price", container);
  }

  set cardTitle(value: string) {
    if (this.title) this.setText(this.title, value);
  }

  set cardImage(value: string) {
    if (this.image) this.setImage(this.image, value);
  }

  set cardCategory(value: string) {
    if (this.category) {
      this.setText(this.category, value);
      const categoryClass =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this.category.className = `card__category ${categoryClass}`;
    }
  }

  set cardPrice(value: number | null) {
    if (this.price)
      this.setText(this.price, value ? `${value} синапсов` : "Бесценно");
  }
}
