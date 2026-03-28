import { IProduct } from '../../types';
import { Card, ICardActions } from './Card';

export class CatalogCard extends Card<IProduct> {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
	}

	render(data: IProduct): HTMLElement {
		return super.render({
			title: data.title,
			price: data.price,
			category: data.category,
			image: data.image,
		});
	}
}