import { IProduct } from "../../types/index";

export class CatalogModel {

  protected items:  IProduct[];
  protected selectedItem: IProduct | null

  constructor() {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(products: IProduct[]): void {
    this.items = products;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}