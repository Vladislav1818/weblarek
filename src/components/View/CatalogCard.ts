import { IProduct } from '../../types';
import { ICardActions } from './Card';
import { ProductCard } from './ProductCard';

export class CatalogCard extends ProductCard<IProduct> {
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