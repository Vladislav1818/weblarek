import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/LarekApi';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { IBuyer, IOrder, IProduct, TBuyerErrors } from './types';

const events = new EventEmitter();

const baseApi = new Api(API_URL, {
	headers: {
		'Content-Type': 'application/json',
	},
});

const larekApi = new LarekApi(baseApi, CDN_URL);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new BasketView(
	cloneTemplate<HTMLElement>('#basket'),
	events
);

const orderForm = new OrderForm(
	cloneTemplate<HTMLFormElement>('#order'),
	events
);

const contactsForm = new ContactsForm(
	cloneTemplate<HTMLFormElement>('#contacts'),
	events
);

const previewCard = new PreviewCard(
	cloneTemplate<HTMLElement>('#card-preview'),
	{
		onClick: () => {
			events.emit('product:toggle-basket');
		},
	}
);

const successView = new Success(
	cloneTemplate<HTMLElement>('#success'),
	{
		onClick: () => modal.close(),
	}
);

function getErrorsText(errors: Array<string | undefined>): string {
	return errors.filter(Boolean).join('. ');
}

function createCatalogCards(): HTMLElement[] {
	return productsModel.getItems().map((item) => {
		const card = new CatalogCard(
			cloneTemplate<HTMLElement>('#card-catalog'),
			{
				onClick: () => events.emit('card:select', item),
			}
		);

		return card.render(item);
	});
}

function createBasketCards(): HTMLElement[] {
	return basketModel.getItems().map((item, index) => {
		const card = new BasketCard(
			cloneTemplate<HTMLElement>('#card-basket'),
			{
				onClick: () => events.emit('basket:item-remove', item),
			}
		);

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
}

function syncCatalog(): void {
	gallery.items = createCatalogCards();
}

function syncHeader(): void {
	header.counter = basketModel.getCount();
}

function syncBasketView(): void {
	basketView.render({
		items: createBasketCards(),
		total: basketModel.getTotal(),
		valid: basketModel.getCount() > 0,
	});
}

function syncPreview(): HTMLElement | null {
	const item = productsModel.getPreview();

	if (!item) {
		return null;
	}

	return previewCard.render({
		...item,
		inBasket: basketModel.hasItem(item.id),
	});
}

function syncBuyerForms(): void {
	const data = buyerModel.getData();
	const errors: TBuyerErrors = buyerModel.validate();

	orderForm.render({
		payment: data.payment,
		address: data.address,
		valid: !errors.payment && !errors.address,
		errors: getErrorsText([errors.payment, errors.address]),
	});

	contactsForm.render({
		email: data.email,
		phone: data.phone,
		valid: !errors.email && !errors.phone,
		errors: getErrorsText([errors.email, errors.phone]),
	});
}

events.on('products:changed', () => {
	syncCatalog();
});

events.on('card:select', (item: IProduct) => {
	productsModel.setPreview(item);
});

events.on('preview:changed', () => {
	const content = syncPreview();

	if (content) {
		modal.render({ content });
	}
});

events.on('product:toggle-basket', () => {
	const item = productsModel.getPreview();

	if (!item || item.price === null) {
		return;
	}

	if (basketModel.hasItem(item.id)) {
		basketModel.removeItem(item);
	} else {
		basketModel.addItem(item);
	}
});

events.on('basket:open', () => {
	modal.render({
		content: basketView.render(),
	});
});

events.on('basket:item-remove', (item: IProduct) => {
	basketModel.removeItem(item);
});

events.on('basket:changed', () => {
	syncHeader();
	syncBasketView();
	syncPreview();
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render(),
	});
});

events.on(
	'form:change',
	(data: { field: keyof IBuyer; value: string }) => {
		buyerModel.setData({
			[data.field]: data.value,
		} as Partial<IBuyer>);
	}
);

events.on('buyer:changed', () => {
	syncBuyerForms();
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render(),
	});
});

events.on('contacts:submit', () => {
	const buyer = buyerModel.getData();

	const order: IOrder = {
		...buyer,
		items: basketModel.getItems().map((item) => item.id),
		total: basketModel.getTotal(),
	};

	larekApi
		.createOrder(order)
		.then((result) => {
			basketModel.clear();
			buyerModel.clear();

			modal.render({
				content: successView.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error('Ошибка оформления заказа:', err);
		});
});

syncHeader();
syncBasketView();
syncBuyerForms();

larekApi
	.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);
	})
	.catch((err) => {
		console.error('Ошибка получения товаров:', err);
	});