import {
	IApi,
	IOrder,
	IOrderResponse,
	IProductsResponse,
} from '../types';

export class LarekApi {
	constructor(private api: IApi, private cdn: string) {}

	getProducts(): Promise<IProductsResponse> {
		return this.api.get('/product/').then((data) => {
			const result = data as IProductsResponse;

			return {
				...result,
				items: result.items.map((item) => ({
					...item,
					image: `${this.cdn}${item.image}`,
				})),
			};
		});
	}

	createOrder(order: IOrder): Promise<IOrderResponse> {
		return this.api.post('/order/', order).then((data) => {
			return data as IOrderResponse;
		});
	}
}