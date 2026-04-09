import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { CatalogModel } from './components/models/CaralogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { AppApi } from './components/models/AppApi';

import { Page } from './components/view/Page';
import { Modal } from './components/view/modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';


import { IProduct, IOrder } from './types';

/**
 * Класс Презентер
 * Отвечает за координацию работы Моделей и Представлений.
 */
class AppPresenter {
    private events: EventEmitter;

    private catalogModel: CatalogModel;
    private cartModel: CartModel;
    private buyerModel: BuyerModel;
    private appApi: AppApi;

    private page: Page;
    private modal: Modal;

    private cardCatalogTemplate: HTMLTemplateElement;
    private cardPreviewTemplate: HTMLTemplateElement;
    private cardBasketTemplate: HTMLTemplateElement;
    private basketTemplate: HTMLTemplateElement;
    private orderTemplate: HTMLTemplateElement;
    private contactsTemplate: HTMLTemplateElement;
    private successTemplate: HTMLTemplateElement;

    constructor() {
        this.events = new EventEmitter();

        const api = new Api(API_URL);
        this.appApi = new AppApi(api);
        this.catalogModel = new CatalogModel(this.events);
        this.cartModel = new CartModel(this.events);
        this.buyerModel = new BuyerModel(this.events);

        this.page = new Page(document.body, this.events);
        this.modal = new Modal(ensureElement('#modal-container') as HTMLElement, this.events);

        this.cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
        this.cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
        this.cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
        this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
        this.orderTemplate = ensureElement('#order') as HTMLTemplateElement;
        this.contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
        this.successTemplate = ensureElement('#success') as HTMLTemplateElement;

        this.setupEventHandlers();

        this.loadCatalog();
    }

    private setupEventHandlers(): void {
        this.events.on('catalog:changed', () => this.renderCatalog());
        this.events.on('cart:changed', () => this.updateCartUI());

        this.events.on('card:select', (data: { id: string }) => this.openProductCard(data.id));
        this.events.on('basket:open', () => this.openBasket());

        this.events.on('card:addToBasket', (data: { id: string }) => this.addToCart(data.id));

        this.events.on('basket:removeItem', (data: { id: string }) => this.removeFromCart(data.id));
        this.events.on('basket:submit', () => this.openOrderForm());

        this.events.on('order:paymentChange', (data: { payment: 'online' | 'cash' }) => this.updatePayment(data.payment));
        this.events.on('form:order:change', (data: { field: string; value: string }) => this.updateOrderFormData(data));
        this.events.on('form:order:submit', () => this.openContactsForm());

        this.events.on('form:contacts:change', (data: { field: string; value: string }) => this.updateContactsFormData(data));
        this.events.on('form:contacts:submit', () => this.submitOrder());

        this.events.on('modal:open', () => this.page.locked = true);
        this.events.on('modal:close', () => this.page.locked = false);
        this.events.on('success:closed', () => this.modal.close());
    }

    private async loadCatalog(): Promise<void> {
        try {
            const products = await this.appApi.getProducts();
            this.catalogModel.setItems(products);
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
        }
    }

    private renderCatalog(): void {
        const catalogItems = this.catalogModel.getItems().map(product => this.createCardCatalog(product));
        this.page.catalog = catalogItems;
    }

    private createCardCatalog(product: IProduct): HTMLElement {
        const cardElement = cloneTemplate(this.cardCatalogTemplate);
        const card = new CardCatalog(cardElement, this.events);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;
        return card.render();
    }

    private openProductCard(id: string): void {
        const product = this.catalogModel.getItemById(id);
        if (product) {
            const inBasket = this.cartModel.contains(product.id);
            const cardPreview = this.createCardPreview(product, inBasket);
            this.modal.render({ content: cardPreview });
        }
    }

    private createCardPreview(product: IProduct, inBasket: boolean = false): HTMLElement {
        const cardElement = cloneTemplate(this.cardPreviewTemplate);
        const card = new CardPreview(cardElement, this.events);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;
        card.description = product.description;
        card.inBasket = inBasket;
        return card.render();
    }

    private addToCart(id: string): void {
        const product = this.catalogModel.getItemById(id);
        if (product && product.price !== null) {
            this.cartModel.addItem(product);
            this.updatePreviewButtonState(id);
        }
    }

    private updatePreviewButtonState(productId: string): void {
        const modalContent = this.modal['contentContainer'].querySelector('.card');
        if (modalContent) {
            const previewCard = new CardPreview(modalContent as HTMLElement, this.events);
            if (previewCard.id === productId) {
                previewCard.inBasket = true;
            }
        }
    }

    private updateCartUI(): void {
        this.page.counter = this.cartModel.getCount();
        if (document.querySelector('.basket')?.closest('.modal_active')) {
            this.openBasket();
        }
    }

    private openBasket(): void {
        const basketContainer = cloneTemplate(this.basketTemplate);
        const basket = new Basket(basketContainer, this.events);
        const items = this.cartModel.getItems();

        if (items.length === 0) {
            basket.disabled = true;
            basket.items = [];
        } else {
            basket.disabled = false;
            const basketItems = items.map((item, index) => this.createCardBasket(item, index + 1));
            basket.items = basketItems;
        }

        basket.total = this.cartModel.getTotal();
        this.modal.render({ content: basketContainer });
    }

    private createCardBasket(product: IProduct, index: number): HTMLElement {
        const cardElement = cloneTemplate(this.cardBasketTemplate);
        const card = new CardBasket(cardElement, this.events);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.index = index;
        return card.render();
    }

    private removeFromCart(id: string): void {
        this.cartModel.removeItem(id);
    }

    private openOrderForm(): void {
        const orderFormContainer = cloneTemplate(this.orderTemplate);
        const orderForm = new OrderForm(orderFormContainer, this.events);
        const buyerData = this.buyerModel.getData();

        orderForm.address = buyerData.address;
        orderForm.payment = buyerData.payment;

        this.modal.render({ content: orderFormContainer });
        this.validateOrderForm(orderFormContainer);
    }

    private updatePayment(payment: 'online' | 'cash'): void {
        this.buyerModel.setData({ payment });
        this.validateOrderForm();
    }

    private updateOrderFormData(data: { field: string; value: string }): void {
        if (data.field === 'address') {
            this.buyerModel.setData({ address: data.value });
            this.validateOrderForm();
        }
    }

    private validateOrderForm(formContainer?: HTMLElement): void {
        const container = formContainer || document.querySelector('.form[name="order"]');
        if (!container) return;

        const address = this.buyerModel.getData().address;
        const payment = this.buyerModel.getData().payment;
        const isValid = address.trim() !== '' && payment !== undefined;

        const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !isValid;

        const errorsElement = container.querySelector('.form__errors') as HTMLElement;
        if (errorsElement) {
            const errors = [];
            if (!address.trim()) errors.push('Адрес не может быть пустым');
            if (!payment) errors.push('Выберите способ оплаты');
            errorsElement.textContent = errors.join(', ');
        }
    }

    private openContactsForm(): void {
        const contactsFormContainer = cloneTemplate(this.contactsTemplate);
        const contactsForm = new ContactsForm(contactsFormContainer, this.events);
        const buyerData = this.buyerModel.getData();

        contactsForm.email = buyerData.email;
        contactsForm.phone = buyerData.phone;

        this.modal.render({ content: contactsFormContainer });
        this.validateContactsForm(contactsFormContainer);
    }

    private updateContactsFormData(data: { field: string; value: string }): void {
        if (data.field === 'email') {
            this.buyerModel.setData({ email: data.value });
        } else if (data.field === 'phone') {
            this.buyerModel.setData({ phone: data.value });
        }
        this.validateContactsForm();
    }

    private validateContactsForm(formContainer?: HTMLElement): void {
        const container = formContainer || document.querySelector('.form[name="contacts"]');
        if (!container) return;

        const email = this.buyerModel.getData().email;
        const phone = this.buyerModel.getData().phone;
        const isValid = email.trim() !== '' && phone.trim() !== '';

        const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) submitButton.disabled = !isValid;

        const errorsElement = container.querySelector('.form__errors') as HTMLElement;
        if (errorsElement) {
            const errors = [];
            if (!email.trim()) errors.push('Email не может быть пустым');
            if (!phone.trim()) errors.push('Телефон не может быть пустым');
            errorsElement.textContent = errors.join(', ');
        }
    }

    private async submitOrder(): Promise<void> {
        const buyerData = this.buyerModel.getData();
        const cartItems = this.cartModel.getItems();
        const total = this.cartModel.getTotal();

        const order: IOrder = {
            ...buyerData,
            items: cartItems.map(item => item.id),
            total: total
        };

        try {
            const result = await this.appApi.postOrder(order);
            const successContainer = cloneTemplate(this.successTemplate);
            const success = new Success(successContainer, this.events);
            success.total = result.total;

            this.modal.render({ content: successContainer });
            this.cartModel.clearCart();
            this.buyerModel.clearData();
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            this.showFormError('.form[name="contacts"]', 'Ошибка при оформлении заказа. Попробуйте позже.');
        }
    }

    private showFormError(selector: string, message: string): void {
        const formContainer = document.querySelector(selector);
        if (formContainer) {
            const errorsElement = formContainer.querySelector('.form__errors') as HTMLElement;
            if (errorsElement) errorsElement.textContent = message;
        }
    }
}

new AppPresenter();