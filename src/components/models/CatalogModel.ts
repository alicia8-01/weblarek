import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CatalogModel {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  getItemsById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }

  setItems(items: IProduct[]): void {
    this.items = items;

    this.events.emit("catalog:changed", { items: this.items });
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;

    this.events.emit("catalog:item-selected", { item: this.selectedItem });
  }
}
