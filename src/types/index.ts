export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	get(uri: string): Promise<object>;
	post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBuyer {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
	total: number;
	items: IProduct[];
}

export interface IOrder extends IBuyer {
	items: string[];
	total: number;
}

export interface IOrderResponse {
	id: string;
	total: number;
}