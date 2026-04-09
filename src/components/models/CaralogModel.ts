import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class CatalogModel {

  protected items:  IProduct[];
  protected selectedItem: IProduct | null

  constructor(protected events: IEvents) {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(products: IProduct[]): void {
    this.items = products;
    this.events.emit('catalog:changed', { items: this.items});
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('catalog:selectedChanged', { item: this.selectedItem});
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}