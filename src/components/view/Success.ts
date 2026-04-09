import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.events.emit('success:closed');
            });
        }
    }
    
    set total(value: number) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = `Списано ${value} синапсов`;
        }
    }
}