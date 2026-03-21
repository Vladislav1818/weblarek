import { IBuyer, TBuyerErrors, TPayment } from '../../types';

export class BuyerModel {
	private data: IBuyer = {
		payment: '' as TPayment,
		email: '',
		phone: '',
		address: '',
	};

	setData(data: Partial<IBuyer>): void {
		this.data = {
			...this.data,
			...data,
		};
	}

	getData(): IBuyer {
		return { ...this.data };
	}

	clear(): void {
		this.data = {
			payment: '' as TPayment,
			email: '',
			phone: '',
			address: '',
		};
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.data.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}

		if (!this.data.address.trim()) {
			errors.address = 'Не указан адрес доставки';
		}

		if (!this.data.email.trim()) {
			errors.email = 'Укажите email';
		}

		if (!this.data.phone.trim()) {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}
}