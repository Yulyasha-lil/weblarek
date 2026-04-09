import { IBuyer } from "../../types/index";
import { IEvents } from "../base/Events";

export class BuyerModel {
    protected payment: 'online' | 'cash';
    protected email: string;
    protected phone: string;
    protected address: string;

    constructor(protected events: IEvents) {
      this.payment = 'online';
      this.email = '';
      this.phone = '';
      this.address = '';
    }

    setData(data: Partial<IBuyer>): void {
      if (data.payment !== undefined) this.payment = data.payment;
      if (data.email !== undefined) this.email = data.email;
      if (data.phone !== undefined) this.phone = data.phone;
      if (data.address !== undefined) this.address = data.address;

      this.events.emit('buyer:changed', this.getData());
    }
    
    getData(): IBuyer {
      return {
        payment: this.payment ,
        email: this.email,
        phone: this.phone,
        address: this.address
      }
    }

    clearData(): void {
      this.payment = 'online';
      this.email = '';
      this.phone = '';
      this.address = '';

      this.events.emit('buyer:changed', this.getData());
    }
    validateField(field: keyof IBuyer, value: string): string | null {
      switch (field) {
        case 'email':
          if (!value || value.trim() === '') return "Email не может быть пустым";
          return null;

        case 'phone':
          if (!value || value.trim() === '') return "Телефон не может быть пустым";
          return null;
          
        case 'address':
          if (!value || value.trim() === '') return "Необходимо указать адрес";
          return null;
        
        case 'payment':
          if (!value) return "Способ оплаты не выбран";
          if (value !== 'online' && value !== 'cash') {
            return "Выберите корректный способ оплаты";
          }
          return null;
          
        default:
          return null;
      }
    }

    validateAll(): Partial<Record<keyof IBuyer, string>> {
      const errors: Partial<Record<keyof IBuyer, string>> = {};
  
      const emailError = this.validateField('email', this.email);
      if (emailError) errors.email = emailError;
      
      const phoneError = this.validateField('phone', this.phone);
      if (phoneError) errors.phone = phoneError;
      
      const addressError = this.validateField('address', this.address);
      if (addressError) errors.address = addressError;
      
      const paymentError = this.validateField('payment', this.payment);
      if (paymentError) errors.payment = paymentError;
      
      return errors;
    }
}