import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

interface IBasketCardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketCardData extends Pick<IProduct, 'title' | 'price'> {
	index: number;
}

export class BasketCard extends Card<IBasketCardData> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions: IBasketCardActions) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

		this.deleteButton.addEventListener('click', (event) => {
			event.preventDefault();
			actions.onClick(event);
		});
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}

	render(data: IBasketCardData): HTMLElement {
		return super.render({
			title: data.title,
			price: data.price,
			index: data.index,
		});
	}
}