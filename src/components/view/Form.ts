import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected formElement: HTMLFormElement;
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.formElement = container as HTMLFormElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        if (this.formElement) {
            this.formElement.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const field = target.name as keyof T;
                const value = target.value;
                this.events.emit(`form:${this.formElement.name}:change`, { field, value });
            });
            
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.events.emit(`form:${this.formElement.name}:submit`);
            });
        }
    }
    
    set errors(value: string) {
        if (this.errorsElement) {
            this.errorsElement.textContent = value;
        }
    }
    
    set valid(value: boolean) {
        if (this.submitButton) {
            this.submitButton.disabled = !value;
        }
    }
    
    protected setInputValue(name: keyof T, value: string) {
        if (this.formElement) {
            const input = this.formElement.querySelector(`[name="${String(name)}"]`) as HTMLInputElement;
            if (input) {
                input.value = value;
            }
        }
    }
    
    clearForm() {
        if (this.formElement) {
            this.formElement.reset();
        }
        this.errors = '';
        this.valid = false;
    }
}