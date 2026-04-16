import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IHeader {
  counter: number
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}