import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, ICardActions } from './Card';

export type TProductCardData = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export class ProductCard<T extends TProductCardData> extends Card<T> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		Object.values(categoryMap).forEach((className) => {
			this.categoryElement.classList.remove(className);
		});

		const className = categoryMap[value as keyof typeof categoryMap];
		if (className) {
			this.categoryElement.classList.add(className);
		}
	}

	set image(value: string) {
		this.setImage(this.imageElement, value, this.titleElement.textContent || '');
	}
}