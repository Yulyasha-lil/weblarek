import { IProduct } from "../../types/index"
import { IEvents } from "../base/Events";

export class CartModel {

  protected items: IProduct[]

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('cart:changed', { items: this.items});
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('cart:changed', { items: this.items});
  }

  clearCart(): void {
    this.items = [];
    this.events.emit('cart:changed', { items: this.items});
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0)
  }

  getCount(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}