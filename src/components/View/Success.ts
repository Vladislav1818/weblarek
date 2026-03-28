import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected closeButton: HTMLButtonElement;
  protected description: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.description = ensureElement<HTMLElement>('.order-success__description', container);

    this.closeButton.addEventListener('click', actions.onClick);
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}