import { IProduct } from "../../types";

export class CatalogModel {
  protected items: IProduct[] = [];
  protected selectedItem: IProduct | null = null;

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
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }
}
