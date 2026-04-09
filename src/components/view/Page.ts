import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<{ counter: number; catalog: HTMLElement[] }> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;
    protected galleryElement: HTMLElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = this.basketButton?.querySelector('.header__basket-counter') as HTMLElement;
        this.galleryElement = container.querySelector('.gallery') as HTMLElement;
        
        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                this.events.emit('basket:open');
            });
        }
    }
    
    set counter(value: number) {
        if (this.counterElement) {
            this.counterElement.textContent = String(value);
        }
    }
    
    set catalog(items: HTMLElement[]) {
        if (this.galleryElement) {
            this.galleryElement.innerHTML = '';
            items.forEach(item => {
                this.galleryElement.appendChild(item);
            });
        }
    }
    
    set locked(value: boolean) {
        if (value) {
            document.body.classList.add('modal_active');
        } else {
            document.body.classList.remove('modal_active');
        }
    }
}