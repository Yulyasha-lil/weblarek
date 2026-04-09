import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLButtonElement;
        
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                this.events.emit('basket:submit');
            });
        }
    }
    
    set items(items: HTMLElement[]) {
        if (this.listElement) {
            this.listElement.innerHTML = '';
            items.forEach(item => {
                this.listElement.appendChild(item);
            });
        }
    }
    
    set total(value: number) {
        if (this.priceElement) {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
    
    set disabled(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = value;
        }
    }
}