import { Form, IFormState } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IContactsForm {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>('input[name=email]', container);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', container);
	}

	protected onSubmit(): void {
		this.events.emit('contacts:submit');
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}

	render(state?: Partial<IContactsForm> & IFormState): HTMLFormElement {
		return super.render(state);
	}
}