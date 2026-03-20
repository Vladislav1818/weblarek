import { IBuyer, TBuyerErrors } from '../../types';

export class BuyerModel {
	private data: Partial<IBuyer> = {};

	setData(data: Partial<IBuyer>): void {
		this.data = {
			...this.data,
			...data,
		};
	}

	getData(): Partial<IBuyer> {
		return { ...this.data };
	}

	clear(): void {
		this.data = {};
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.data.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}

		if (!this.data.address || this.data.address.trim() === '') {
			errors.address = 'Не указан адрес доставки';
		}

		if (!this.data.email || this.data.email.trim() === '') {
			errors.email = 'Укажите email';
		}

		if (!this.data.phone || this.data.phone.trim() === '') {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}

	validateStepOne(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.data.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}

		if (!this.data.address || this.data.address.trim() === '') {
			errors.address = 'Не указан адрес доставки';
		}

		return errors;
	}

	validateStepTwo(): TBuyerErrors {
		const errors: TBuyerErrors = {};

		if (!this.data.email || this.data.email.trim() === '') {
			errors.email = 'Укажите email';
		}

		if (!this.data.phone || this.data.phone.trim() === '') {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}
}