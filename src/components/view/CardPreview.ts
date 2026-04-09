import { Card } from './Card';
import { IEvents } from '../base/Events';

export class CardPreview extends Card {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                this.events.emit('card:addToBasket', { id: this.id });
            });
        }
    }
    
    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }
    
    set buttonText(value: string) {
        if (this.buttonElement && !this.buttonElement.disabled) {
            this.buttonElement.textContent = value;
        }
    }
    
    set inBasket(value: boolean) {
        if (this.buttonElement && !this.buttonElement.disabled) {
            this.buttonElement.disabled = value;
            this.buttonElement.textContent = value ? 'Уже в корзине' : 'В корзину';
        }
    }
}