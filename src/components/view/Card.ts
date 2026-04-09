import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement | null;
    protected imageElement?: HTMLImageElement | null;
    protected descriptionElement?: HTMLElement | null;
    protected buttonElement?: HTMLButtonElement | null;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.categoryElement = container.querySelector('.card__category');
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
        this.descriptionElement = container.querySelector('.card__text');
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
    }
    
    set id(value: string) {
        this.container.dataset.id = value;
    }
    
    get id(): string {
        return this.container.dataset.id || '';
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
        
        if (value === null && this.buttonElement) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Не продаётся';
        }
    }
    
    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this.categoryElement.className = `card__category ${modifier}`;
        }
    }
    
    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, value, this.title);
        }
    }
}