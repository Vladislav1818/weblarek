import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

export class Card<T> extends Component<T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.titleElement = container.querySelector('.card__title') as HTMLElement;
		this.priceElement = container.querySelector('.card__price') as HTMLElement;

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}
}

export type TCardData = Pick<IProduct, 'title' | 'price'>;