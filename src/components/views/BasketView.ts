import { IProduct } from "../../types";
import { CardBasketView } from "./Card/CardBasketView";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { cloneTemplate } from "../../utils/utils";

interface IBasket {
  items: IProduct[];
  total: number;
}

interface IBasketAction {
  onClick: () => void;
  onRemove: (id: string) => void;
}

export class BasketView extends Component<IBasket> {
  protected list: HTMLElement;
  protected total: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, private action: IBasketAction) {
    super(container);

    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.total = ensureElement<HTMLElement>(".basket__price", container);
    this.button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );

    this.button.addEventListener("click", () => this.action.onClick());
  }

  set items(items: IProduct[]) {
    if (items.length === 0) {
      const emptyMessage = document.createElement("ol");
      emptyMessage.classList.add("basket__item", "basket__item_empty");
      emptyMessage.textContent = "Корзина пуста";

      this.list.innerHTML = "";
      this.list.appendChild(emptyMessage);
    } else {
      this.list.innerHTML = "";
      items.forEach((item, index) => {
        const card = new CardBasketView(
          cloneTemplate<HTMLElement>("#card-basket"),
          {
            onClick: () => this.action.onRemove(item.id),
          }
        );

        const cardElement = card.render({
          id: item.id,
          title: item.title,
          price: item.price,
          index: index + 1,
        });

        this.list.append(cardElement);
      });
    }
  }

  set countTotal(value: number) {
    this.setText(this.total, `${value} синапсов`);
  }

  set buttonDisabled(value: boolean) {
    this.button.disabled = value;
  }

  render(data: IBasket): HTMLElement {
    super.render(data);

    this.items = data.items;
    this.countTotal = data.total;
    this.buttonDisabled = data.items.length === 0;

    return this.container;
  }
}
