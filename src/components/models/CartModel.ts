import { IProduct } from "../../types/index"

export class CartModel {

  items: IProduct[]

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items.filter(item => item.id !== id);
  }

  clearCart(): void {
    this.items = [];
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