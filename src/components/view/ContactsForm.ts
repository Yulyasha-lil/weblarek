import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    }
    
    set email(value: string) {
        this.setInputValue('email', value);
    }
    
    set phone(value: string) {
        this.setInputValue('phone', value);
    }
}