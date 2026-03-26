import { IBuyer } from "../../types/index";

export class BuyerModel {
    payment: 'online' | 'cash';
    email: string;
    phone: string;
    address: string;

    constructor() {
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
    }

    validateField(field: keyof IBuyer, value: string): string | null {
      switch (field) {
        case 'email':
          const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
          if (!value) return "Email не может быть пустым";
          if (!emailRegex.test(value)) return "Введите корректный email";
          return null;

        case 'phone':
          const phoneRegex = /^\+?[0-9]{10,15}$/;
          if (!value) return "Телефон не может быть пустым";
          if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) 
            return "Введите корректный телефон";
          return null;
        case 'address':
          if (!value) return 'Адрес не может быть пустым';
          if (value.length < 15) return 'Адрес должен содержать минимум 15 символов';
          return null;
        
        case 'payment':
          if (!value) return 'Способ оплаты не выбран';
          if (value !== 'online' && value !== 'cash') {
            return 'Выберите корректный способ оплаты';
          }
          return null;
          
        default:
          return null
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