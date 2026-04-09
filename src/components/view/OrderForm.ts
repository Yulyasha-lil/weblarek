import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ payment: string; address: string }> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
        this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
        
        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.setPayment('online');
                this.events.emit('order:paymentChange', { payment: 'online' });
            });
        }
        
        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.setPayment('cash');
                this.events.emit('order:paymentChange', { payment: 'cash' });
            });
        }
    }
    
    set payment(value: 'online' | 'cash') {
        this.setPayment(value);
    }
    
    set address(value: string) {
        this.setInputValue('address', value);
    }
    
    protected setPayment(value: 'online' | 'cash') {
        if (this.cardButton && this.cashButton) {
            if (value === 'online') {
                this.cardButton.classList.add('button_alt-active');
                this.cashButton.classList.remove('button_alt-active');
            } else {
                this.cashButton.classList.add('button_alt-active');
                this.cardButton.classList.remove('button_alt-active');
            }
        }
    }
}