import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { ProductCard } from './ProductCard';

interface IPreviewCardActions {
	onClick: () => void;
}

export interface IPreviewCardData extends IProduct {
	inBasket: boolean;
}

export class PreviewCard extends ProductCard<IPreviewCardData> {
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions: IPreviewCardActions) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

		this.buttonElement.addEventListener('click', (event) => {
			event.preventDefault();
			actions.onClick();
		});
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	render(data: IPreviewCardData): HTMLElement {
		super.render({
			title: data.title,
			price: data.price,
			category: data.category,
			image: data.image,
		});

		this.description = data.description;

		if (data.price === null) {
			this.buttonElement.disabled = true;
			this.buttonElement.textContent = 'Недоступно';
		} else {
			this.buttonElement.disabled = false;
			this.buttonElement.textContent = data.inBasket ? 'Удалить из корзины' : 'Купить';
		}

		return this.container;
	}
}