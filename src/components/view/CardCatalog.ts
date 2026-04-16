import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>

export interface ICardCatalogActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: Partial<ICardCatalogActions>) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}/${value}`, this.titleElement.textContent ?? '');
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap] ?? '');
  }

}