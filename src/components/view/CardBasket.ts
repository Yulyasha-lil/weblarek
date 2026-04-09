import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected itemId: string = '';
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                this.events.emit('basket:removeItem', { id: this.itemId });
            });
        }
    }
    
    set id(value: string) {
        this.itemId = value;
        this.container.dataset.id = value;
    }
    
    get id(): string {
        return this.itemId;
    }
    
    set index(value: number) {
        if (this.indexElement) {
            this.indexElement.textContent = String(value);
        }
    }
    
    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }
    
    set price(value: number | null) {
        if (this.priceElement) {
            if (value === null) {
                this.priceElement.textContent = 'Бесценно';
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }
}