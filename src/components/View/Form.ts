import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
	valid: boolean;
	errors: string;
}

export class Form<T> extends Component<IFormState> {
	protected submitButton: HTMLButtonElement;
	protected errorsContainer: HTMLElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
		this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

		container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;

			this.events.emit('form:change', {
				field,
				value,
			});
		});

		container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();

			if (this.submitButton.disabled) {
				return;
			}

			this.onSubmit();
		});
	}

	protected onSubmit(): void {
		// Переопределяется в дочерних классах
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsContainer.textContent = value;
	}

	render(state?: Partial<T> & IFormState): HTMLFormElement {
		super.render(state);
		return this.container as HTMLFormElement;
	}
}