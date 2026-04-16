import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export interface IBasketView {
  content: HTMLLIElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected contentList: HTMLUListElement;
  protected buttonOrder: HTMLButtonElement;
  protected totalAmount: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.contentList = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.totalAmount = ensureElement<HTMLElement>('.basket__price', this.container);

    this.buttonOrder.addEventListener('click', () => {
      this.events.emit('basket:order');
    });
  }

  set content(value: HTMLLIElement[]) {
    this.contentList.replaceChildren(...value);
    this.buttonOrder.disabled = value.length === 0;
  }

  set total(value: number) {
    this.totalAmount.textContent = `${value} синапсов`;
  }
}