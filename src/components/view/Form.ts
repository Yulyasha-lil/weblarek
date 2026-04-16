import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IFormState {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T & IFormState> {
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;

      if (!target.name) {
        return;
      }

      this.onInputChange(target.name as keyof T, target.value);
    });
  }

  protected onInputChange(field: keyof T, value: string): void {
    this.events.emit(`form:change`, {
      form: this.container.name,
      field,
      value,
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }

  render(data?: Partial<T & IFormState>): HTMLElement {
    return super.render(data);
  }
}