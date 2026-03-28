import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

export class Card<T> extends Component<T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected categoryElement: HTMLElement | null;
	protected imageElement: HTMLImageElement | null;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', container);
		this.categoryElement = container.querySelector('.card__category');
		this.imageElement = container.querySelector('.card__image');

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

	set category(value: string) {
		if (!this.categoryElement) {
			return;
		}

		this.categoryElement.textContent = value;

		Object.values(categoryMap).forEach((className) => {
			this.categoryElement?.classList.remove(className);
		});

		const className = categoryMap[value as keyof typeof categoryMap];
		if (className) {
			this.categoryElement.classList.add(className);
		}
	}

	set image(value: string) {
		if (!this.imageElement) {
			return;
		}

		this.setImage(this.imageElement, value, this.titleElement.textContent || '');
	}
}

export type TCardProductData = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;