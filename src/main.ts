import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/LarekApi';

import { apiProducts } from './utils/data';
import { API_URL, CDN_URL } from './utils/constants';

const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

// Проверка ProductsModel
productsModel.setItems(apiProducts.items);
console.log('Каталог товаров:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
const secondProduct = productsModel.getItems()[1];

console.log(
	'Товар по id:',
	productsModel.getItemById(firstProduct.id)
);

productsModel.setPreview(firstProduct);
console.log('Товар для предпросмотра:', productsModel.getPreview());

// Проверка BasketModel
basketModel.addItem(firstProduct);
basketModel.addItem(secondProduct);

console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());
console.log(
	'Есть ли первый товар в корзине:',
	basketModel.hasItem(firstProduct.id)
);

basketModel.removeItem(firstProduct);
console.log('Корзина после удаления товара:', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// Проверка BuyerModel
buyerModel.setData({
	payment: 'card',
	address: 'Москва, ул. Пушкина, д. 10',
});
console.log('Данные покупателя после первого шага:', buyerModel.getData());
console.log('Ошибки первого шага:', buyerModel.validateStepOne());

buyerModel.setData({
	email: 'test@test.ru',
	phone: '+79990000000',
});
console.log('Данные покупателя после второго шага:', buyerModel.getData());
console.log('Ошибки второго шага:', buyerModel.validateStepTwo());
console.log('Полная валидация:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

// Проверка LarekApi
const baseApi = new Api(API_URL, {
	headers: {
		'Content-Type': 'application/json',
	},
});

const larekApi = new LarekApi(baseApi, CDN_URL);

larekApi
	.getProducts()
	.then((data) => {
		productsModel.setItems(data.items);
		console.log('Каталог, полученный с сервера:', productsModel.getItems());
	})
	.catch((err) => {
		console.error('Ошибка получения товаров с сервера:', err);
	});