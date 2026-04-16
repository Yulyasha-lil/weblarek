import { IBuyer } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

type TOrderForm = Pick<IBuyer, 'payment' | 'address'>;

export class OrderForm extends Form<TOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name=address]', this.container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.onInputChange('payment', button.name);
      });
    });
  }

  set payment(value: TOrderForm['payment']) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}