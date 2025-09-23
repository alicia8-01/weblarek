import { IProduct } from "../../types";
import { CardCatalogView } from "./Card/CardCatalogView";
import { Component } from "../base/Component";
import { cloneTemplate, replaceExtensionToPng } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

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
    this.cards = items.map((item) => {
      const card = new CardCatalogView(
        cloneTemplate<HTMLElement>("#card-catalog"),
        {
          onClick: () => this.action.onClick(item),
        }
      );

      const imageUrl = item.image
        ? `${CDN_URL}/${replaceExtensionToPng(item.image)}`
        : "";

      const cardElement = card.render({
        ...item,
        title: item.title,
        image: imageUrl,
        category: item.category,
        price: item.price,
      });

      this.container.append(cardElement);

      return card;
    });

    return this.container;
  }
}
