import { IProduct } from "../../types";
import { CardCatalogView } from "./Card/CardCatalogView";
import { Component } from "../base/Component";
import { replaceExtensionToPng } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface IGalleryAction {
  onClick: (item: IProduct) => void;
}

export class GalleryView extends Component<IProduct[]> {
  protected cards: CardCatalogView[];

  constructor(container: HTMLElement, private action: IGalleryAction) {
    super(container);

    this.cards = [];
  }

  render(items: IProduct[]): HTMLElement {
    super.render();
    this.container.innerHTML = "";

    items.forEach((item) => {
      const template = document.getElementById(
        "card-catalog"
      ) as HTMLTemplateElement;
      const cardElement = template.content.firstElementChild?.cloneNode(
        true
      ) as HTMLElement;

      if (cardElement) {
        const titleElement = cardElement.querySelector(".card__title");
        const priceElement = cardElement.querySelector(".card__price");
        const categoryElement = cardElement.querySelector(".card__category");
        const imageElement = cardElement.querySelector(
          ".card__image"
        ) as HTMLImageElement;

        if (titleElement) titleElement.textContent = item.title;

        if (priceElement)
          priceElement.textContent = item.price
            ? `${item.price} синапсов`
            : "Бесценно";

        if (categoryElement) {
          categoryElement.textContent = item.category;
          const categoryClass =
            categoryMap[item.category as keyof typeof categoryMap] ||
            "card__category_other";
          categoryElement.className = `card__category ${categoryClass}`;
        }
        if (imageElement && item.image) {
          const imageUrl = `${CDN_URL}/${replaceExtensionToPng(item.image)}`;
          imageElement.src = imageUrl;
          imageElement.alt = item.title;
        }

        cardElement.addEventListener("click", () => this.action.onClick(item));
        this.container.appendChild(cardElement);
      }
    });

    return this.container;
  }
}
