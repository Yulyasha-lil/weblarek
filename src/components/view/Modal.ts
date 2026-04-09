// src/components/view/Modal.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentContainer = this.container.querySelector('.modal__content') as HTMLElement;
        
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }
    
    set content(value: HTMLElement) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(value);
        }
    }
    
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    
    close() {
        this.container.classList.remove('modal_active');
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
        }
        this.events.emit('modal:close');
    }
    
    render(data: { content: HTMLElement }): HTMLElement {
        this.content = data.content;
        this.open();
        return this.container;
    }
}