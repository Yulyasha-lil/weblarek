import { Component } from "../base/Component";

export interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected galleryContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.galleryContainer = container;
  }

  set items(items: HTMLElement[]) {
    this.galleryContainer.replaceChildren(...items);
  }

  update(items: HTMLElement[]): void {
    this.items = items;
  }
}