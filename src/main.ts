import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/LarekApi';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { IBuyer, IOrder, IProduct, TBuyerErrors } from './types';

type TModalView = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null;

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

const page = new Page(document.body, events);
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

const successView = new Success(
	cloneTemplate<HTMLElement>('#success'),
	{
		onClick: () => modal.close(),
	}
);

let currentView: TModalView = null;

function getErrorsText(errors: TBuyerErrors): string {
	return Object.values(errors).filter(Boolean).join('. ');
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

function renderCatalog(): void {
	page.render({
		catalog: createCatalogCards(),
		counter: basketModel.getCount(),
	});
}

function renderPreview(item: IProduct): void {
	currentView = 'preview';

	const card = new PreviewCard(
		cloneTemplate<HTMLElement>('#card-preview'),
		{
			onClick: (event: MouseEvent) => {
				event.preventDefault();
				events.emit('product:toggle-basket', item);
			},
		}
	);

	modal.render({
		content: card.render({
			...item,
			inBasket: basketModel.hasItem(item.id),
		}),
	});
}

function renderBasket(): void {
	currentView = 'basket';

	modal.render({
		content: basketView.render({
			items: createBasketCards(),
			total: basketModel.getTotal(),
			valid: basketModel.getCount() > 0,
		}),
	});
}

function renderOrderForm(): void {
	currentView = 'order';

	const data = buyerModel.getData();
	const errors = buyerModel.validateStepOne();

	modal.render({
		content: orderForm.render({
			payment: data.payment,
			address: data.address,
			valid: Object.keys(errors).length === 0,
			errors: getErrorsText(errors),
		}),
	});
}

function renderContactsForm(): void {
	currentView = 'contacts';

	const data = buyerModel.getData();
	const errors = buyerModel.validateStepTwo();

	modal.render({
		content: contactsForm.render({
			email: data.email,
			phone: data.phone,
			valid: Object.keys(errors).length === 0,
			errors: getErrorsText(errors),
		}),
	});
}

function renderSuccess(total: number): void {
	currentView = 'success';

	modal.render({
		content: successView.render({
			total,
		}),
	});
}

events.on('products:changed', () => {
	renderCatalog();
});

events.on('card:select', (item: IProduct) => {
	productsModel.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const preview = item || productsModel.getPreview();

	if (preview) {
		renderPreview(preview);
	}
});

events.on('product:toggle-basket', (item: IProduct) => {
	modal.close();

	if (basketModel.hasItem(item.id)) {
		basketModel.removeItem(item);
	} else {
		basketModel.addItem(item);
	}
});

events.on('basket:open', () => {
	renderBasket();
});

events.on('basket:item-remove', (item: IProduct) => {
	basketModel.removeItem(item);
});

events.on('basket:changed', () => {
	page.counter = basketModel.getCount();

	if (currentView === 'basket') {
		renderBasket();
	}

	if (currentView === 'preview') {
		const preview = productsModel.getPreview();
		if (preview) {
			renderPreview(preview);
		}
	}
});

events.on('order:open', () => {
	renderOrderForm();
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
	if (currentView === 'order') {
		renderOrderForm();
	}

	if (currentView === 'contacts') {
		renderContactsForm();
	}
});

events.on('order:submit', () => {
	const errors = buyerModel.validateStepOne();

	if (Object.keys(errors).length > 0) {
		renderOrderForm();
		return;
	}

	renderContactsForm();
});

events.on('contacts:submit', () => {
	const errors = buyerModel.validateStepTwo();

	if (Object.keys(errors).length > 0) {
		renderContactsForm();
		return;
	}

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
			renderSuccess(result.total);
		})
		.catch((err) => {
			console.error('Ошибка оформления заказа:', err);
		});
});

events.on('modal:close', () => {
	currentView = null;
});

larekApi
	.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);
	})
	.catch((err) => {
		console.error('Ошибка получения товаров:', err);
	});