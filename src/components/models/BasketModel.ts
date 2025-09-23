import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class BasketModel {
  protected items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  addItem(item: IProduct): void {
    this.items.push(item);

    this.basketChanged();
  }

  deleteItem(id: string): void {
    this.items.filter((i) => i.id !== id);

    this.basketChanged();
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return item.price !== null ? total + item.price : total;
    }, 0);
  }

  clear(): void {
    this.items = [];

    this.basketChanged();
  }

  isItemInBasket(id: string): boolean {
    return this.items.some((i) => i.id === id);
  }

  private basketChanged(): void {
    this.events.emit("cart:changed", {
      items: this.items,
      total: this.getTotalPrice(),
      count: this.getItemCount(),
    });
  }
}
