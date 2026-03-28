import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export class BasketView extends Component<IBasketView> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.price = ensureElement<HTMLElement>('.basket__price', container);

    this.button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
    } else {
      const empty = document.createElement('p');
      empty.textContent = 'Корзина пуста';
      this.list.replaceChildren(empty);
    }
  }

  set total(value: number) {
    this.price.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.button.disabled = !value;
  }
}