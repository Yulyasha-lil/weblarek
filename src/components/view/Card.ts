import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export type TCard = Pick<IProduct, 'title' | 'price'>

export abstract class Card<T = object> extends Component<T & TCard> {
  protected priceElement: HTMLElement;
  protected titleElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container)
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
  }

  set price(value: number | null) {
    if (typeof value === 'number') {
      this.priceElement.textContent = `${String(value)} синапсов`;
    } else {
      this.priceElement.textContent = 'Бесценно';
    }
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  render(data?: Partial<T & TCard>): HTMLElement {
    return super.render(data);
  }
}