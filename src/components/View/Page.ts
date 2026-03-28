import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IPage {
  catalog: HTMLElement[];
  counter: number;
}

export class Page extends Component<IPage> {
  protected gallery: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.gallery = ensureElement<HTMLElement>('.gallery', container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}