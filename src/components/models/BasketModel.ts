import { IProduct } from "../../types";

export class BasketModel {
  protected items: IProduct[] = [];

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  deleteItem(id: string): void {
    this.items.filter((i) => i.id !== id);
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

  clearBasket(): void {
    this.items = [];
  }

  isItemInBasket(id: string): boolean {
    return this.items.some((i) => i.id === id);
  }
}
