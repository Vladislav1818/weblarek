# Проектная работа «Веб-ларёк»

Стек: HTML, SCSS, TypeScript, Vite

## Описание проекта

«Веб-ларёк» — это интернет-магазин с товарами для веб-разработчиков.

Пользователь может:

* просматривать каталог товаров;
* открывать карточку товара в модальном окне;
* добавлять товары в корзину;
* удалять товары из корзины;
* открывать корзину;
* переходить к оформлению заказа;
* заполнять форму заказа в два шага;
* отправлять заказ на сервер;
* получать сообщение об успешном оформлении заказа.

Проект реализован по архитектуре MVP (Model-View-Presenter).

## Установка и запуск

Для установки зависимостей выполните команду:

```bash
npm install
```

Для запуска проекта в режиме разработки:

```bash
npm run dev
```

Для сборки проекта:

```bash
npm run build
```

Для предпросмотра production-сборки:

```bash
npm run preview
```

## Структура проекта

```text
src/
├── components/
│   ├── base/         # базовые классы
│   ├── Models/       # модели данных
│   └── View/         # компоненты представления
├── scss/             # стили
├── types/            # типы и интерфейсы
└── utils/            # утилиты и константы
```

## Основные файлы

* `src/main.ts` — точка входа и реализация презентера.
* `src/types/index.ts` — основные типы и интерфейсы приложения.
* `src/utils/constants.ts` — константы проекта.
* `src/utils/utils.ts` — вспомогательные утилиты.
* `src/components/LarekApi.ts` — слой работы с API.
* `src/components/Models/ProductsModel.ts` — модель каталога и превью товара.
* `src/components/Models/BasketModel.ts` — модель корзины.
* `src/components/Models/BuyerModel.ts` — модель покупателя.
* `src/components/View/Header.ts` — представление хедера.
* `src/components/View/Gallery.ts` — представление каталога.

## Архитектура приложения

Приложение разделено на три слоя:

### Model

Модели отвечают за хранение, изменение и валидацию данных.

### View

Представления отвечают за отображение интерфейса и создание пользовательских событий.

### Presenter

Презентер связывает модели и представления. В проекте он реализован в файле `src/main.ts`.

Взаимодействие между слоями построено через брокер событий `EventEmitter`.

## Типы данных

### Тип HTTP-метода

```ts
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

### Интерфейс API

```ts
interface IApi {
	get(uri: string): Promise<any>;
	post(uri: string, data: object, method?: ApiPostMethods): Promise<any>;
}
```

### Тип оплаты

```ts
type TPayment = 'card' | 'cash';
```

### Интерфейс товара

```ts
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

Поля интерфейса:

* `id: string` — идентификатор товара.
* `description: string` — описание товара.
* `image: string` — путь к изображению товара.
* `title: string` — название товара.
* `category: string` — категория товара.
* `price: number | null` — цена товара. Если значение `null`, товар недоступен.

### Интерфейс покупателя

```ts
interface IBuyer {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
}
```

Поля интерфейса:

* `payment: TPayment` — выбранный способ оплаты.
* `email: string` — email покупателя.
* `phone: string` — телефон покупателя.
* `address: string` — адрес доставки.

### Тип ошибок валидации

```ts
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
```

### Ответ сервера со списком товаров

```ts
interface IProductsResponse {
	total: number;
	items: IProduct[];
}
```

### Интерфейс заказа

```ts
interface IOrder extends IBuyer {
	items: string[];
	total: number;
}
```

Поля интерфейса:

* `payment: TPayment` — способ оплаты.
* `email: string` — email покупателя.
* `phone: string` — телефон покупателя.
* `address: string` — адрес доставки.
* `items: string[]` — массив идентификаторов товаров.
* `total: number` — общая стоимость заказа.

### Ответ сервера на оформление заказа

```ts
interface IOrderResponse {
	id: string;
	total: number;
}
```

## Базовые классы

## Класс `Component<T>`

Базовый класс для всех компонентов интерфейса.

### Наследование

Базовый класс, от которого наследуются все компоненты представления.

### Конструктор

```ts
constructor(container: HTMLElement)
```

### Поля

* `container: HTMLElement` — корневой DOM-элемент компонента.

### Методы

* `toggleClass(element: HTMLElement, className: string, force?: boolean): void` — переключает CSS-класс.
* `setText(element: HTMLElement, value: unknown): void` — устанавливает текстовое содержимое элемента.
* `setDisabled(element: HTMLElement, state: boolean): void` — управляет состоянием `disabled`.
* `setHidden(element: HTMLElement): void` — скрывает элемент.
* `setVisible(element: HTMLElement): void` — показывает элемент.
* `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение и альтернативный текст.
* `render(data?: Partial<T>): HTMLElement` — записывает данные в экземпляр и возвращает контейнер компонента.

## Класс `Api`

Базовый класс для выполнения HTTP-запросов.

### Конструктор

```ts
constructor(baseUrl: string, options: RequestInit = {})
```

### Поля

* `baseUrl: string` — базовый URL сервера.
* `options: RequestInit` — конфигурация запросов.

### Методы

* `get(uri: string): Promise<any>` — выполняет GET-запрос.
* `post(uri: string, data: object, method?: ApiPostMethods): Promise<any>` — выполняет POST, PUT или DELETE-запрос.
* `handleResponse(response: Response): Promise<any>` — обрабатывает ответ сервера.

## Класс `EventEmitter`

Брокер событий приложения.

### Поля

* `_events: Map<string, Set<Function>>` — коллекция подписок на события.

### Методы

* `on(eventName: string, callback: Function): void` — подписывает обработчик на событие.
* `off(eventName: string, callback: Function): void` — удаляет обработчик события.
* `emit(eventName: string, data?: unknown): void` — генерирует событие.
* `onAll(callback: Function): void` — подписывает обработчик на все события.
* `offAll(): void` — удаляет все подписки.
* `trigger(eventName: string, context?: object): Function` — возвращает функцию-обработчик для генерации события.

## Коммуникационный слой

## Класс `LarekApi`

Класс для работы с сервером магазина.

### Конструктор

```ts
constructor(api: IApi, cdn: string)
```

### Поля

* `api: IApi` — экземпляр класса для HTTP-запросов.
* `cdn: string` — базовый путь к изображениям.

### Методы

* `getProducts(): Promise<IProductsResponse>` — получает список товаров.
* `createOrder(order: IOrder): Promise<IOrderResponse>` — отправляет заказ на сервер.

## Модели данных

## Класс `ProductsModel`

Модель каталога товаров и текущего превью.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

* `items: IProduct[]` — массив товаров каталога.
* `preview: IProduct | null` — текущий товар, выбранный для превью.
* `events: IEvents` — брокер событий.

### Методы

* `setItems(items: IProduct[]): void` — сохраняет список товаров и генерирует событие `products:changed`.
* `getItems(): IProduct[]` — возвращает массив товаров.
* `getItemById(id: string): IProduct | undefined` — возвращает товар по его идентификатору.
* `setPreview(item: IProduct | null): void` — сохраняет товар для превью и генерирует событие `preview:changed`.
* `getPreview(): IProduct | null` — возвращает текущий товар превью.

### События

* `products:changed` — обновлён каталог товаров.
* `preview:changed` — изменён выбранный товар превью.

## Класс `BasketModel`

Модель корзины.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

* `items: IProduct[]` — товары в корзине.
* `events: IEvents` — брокер событий.

### Методы

* `getItems(): IProduct[]` — возвращает товары корзины.
* `addItem(item: IProduct): void` — добавляет товар в корзину и генерирует событие `basket:changed`.
* `removeItem(item: IProduct): void` — удаляет товар из корзины и генерирует событие `basket:changed`.
* `clear(): void` — очищает корзину и генерирует событие `basket:changed`.
* `getTotal(): number` — возвращает общую стоимость товаров корзины.
* `getCount(): number` — возвращает количество товаров в корзине.
* `hasItem(id: string): boolean` — проверяет наличие товара в корзине.

### События

* `basket:changed` — изменено содержимое корзины.

## Класс `BuyerModel`

Модель данных покупателя.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

* `data: IBuyer` — данные покупателя.
* `events: IEvents` — брокер событий.

### Методы

* `setData(data: Partial<IBuyer>): void` — обновляет часть данных покупателя и генерирует событие `buyer:changed`.
* `getData(): IBuyer` — возвращает текущие данные покупателя.
* `clear(): void` — очищает данные покупателя и генерирует событие `buyer:changed`.
* `validate(): TBuyerErrors` — выполняет полную валидацию полей покупателя.

### События

* `buyer:changed` — изменены данные покупателя.

## Слой представления

## Класс `Header`

Представление шапки сайта.

### Наследование

`Header extends Component<IHeader>`

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

* `basketButton: HTMLButtonElement` — кнопка открытия корзины.
* `basketCounter: HTMLElement` — счётчик товаров в корзине.
* `events: IEvents` — брокер событий.

### Методы

* `set counter(value: number)` — обновляет значение счётчика корзины.

### События

* `basket:open` — открытие корзины.

## Класс `Gallery`

Представление галереи карточек каталога.

### Наследование

`Gallery extends Component<IGallery>`

### Конструктор

```ts
constructor(container: HTMLElement)
```

### Поля

* `container: HTMLElement` — контейнер галереи.

### Методы

* `set items(value: HTMLElement[])` — заменяет содержимое галереи набором карточек.

## Класс `Modal`

Компонент модального окна.

### Наследование

`Modal extends Component<IModalData>`

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

* `closeButton: HTMLButtonElement` — кнопка закрытия модального окна.
* `content: HTMLElement` — контейнер содержимого модального окна.
* `events: IEvents` — брокер событий.

### Методы

* `open(): void` — открывает модальное окно.
* `close(): void` — закрывает модальное окно.
* `render(data: IModalData): HTMLElement` — отображает переданное содержимое в модальном окне.

### События

* `modal:open` — модальное окно открыто.
* `modal:close` — модальное окно закрыто.

## Класс `Card<T>`

Базовый класс карточек.

### Наследование

`Card<T> extends Component<T>`

### Конструктор

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

### Поля

* `titleElement: HTMLElement` — элемент заголовка карточки.
* `priceElement: HTMLElement` — элемент цены карточки.

### Методы

* `set title(value: string)` — устанавливает название товара.
* `set price(value: number | null)` — устанавливает цену товара.

## Класс `ProductCard<T>`

Промежуточный базовый класс для карточек с изображением и категорией.

### Наследование

`ProductCard<T> extends Card<T>`

### Конструктор

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

### Поля

* `categoryElement: HTMLElement` — элемент категории.
* `imageElement: HTMLImageElement` — элемент изображения.

### Методы

* `set category(value: string)` — устанавливает категорию товара и CSS-класс категории.
* `set image(value: string)` — устанавливает изображение товара.

## Класс `CatalogCard`

Карточка товара в каталоге.

### Наследование

`CatalogCard extends ProductCard<IProduct>`

### Конструктор

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

### Методы

* `render(data: IProduct): HTMLElement` — отображает карточку товара в каталоге.

### События

* `card:select` — выбран товар для превью.

## Класс `PreviewCard`

Карточка товара в модальном окне.

### Наследование

`PreviewCard extends ProductCard<IPreviewCardData>`

### Конструктор

```ts
constructor(container: HTMLElement, actions: IPreviewCardActions)
```

### Поля

* `descriptionElement: HTMLElement` — элемент описания товара.
* `buttonElement: HTMLButtonElement` — кнопка действия с товаром.

### Методы

* `set description(value: string)` — устанавливает описание товара.
* `render(data: IPreviewCardData): HTMLElement` — отображает полную карточку товара.

### События

* `product:toggle-basket` — добавить или удалить товар из корзины.

## Класс `BasketCard`

Карточка товара в корзине.

### Наследование

`BasketCard extends Card<IBasketCard>`

### Конструктор

```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

### Поля

* `indexElement: HTMLElement` — порядковый номер товара.
* `deleteButton: HTMLButtonElement` — кнопка удаления товара.

### Методы

* `set index(value: number)` — устанавливает индекс товара в корзине.
* `render(data: IBasketCard): HTMLElement` — отображает карточку товара в корзине.

### События

* `basket:item-remove` — удалить товар из корзины.

## Класс `BasketView`

Компонент отображения корзины.

### Наследование

`BasketView extends Component<IBasketView>`

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

* `listElement: HTMLElement` — контейнер списка товаров.
* `buttonElement: HTMLButtonElement` — кнопка перехода к оформлению.
* `priceElement: HTMLElement` — элемент общей стоимости.
* `events: IEvents` — брокер событий.

### Методы

* `set items(value: HTMLElement[])` — обновляет список товаров корзины.
* `set total(value: number)` — устанавливает общую стоимость.
* `set valid(value: boolean)` — управляет доступностью кнопки оформления.
* `render(data?: Partial<IBasketView>): HTMLElement` — отображает состояние корзины.

### События

* `order:open` — открыть форму заказа.

## Класс `Form<T>`

Базовый класс форм.

### Наследование

`Form<T> extends Component<T>`

### Конструктор

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

### Поля

* `submitButton: HTMLButtonElement` — кнопка отправки формы.
* `errorsContainer: HTMLElement` — контейнер ошибок.
* `events: IEvents` — брокер событий.

### Методы

* `set valid(value: boolean)` — управляет состоянием кнопки отправки.
* `set errors(value: string)` — отображает строку ошибок.
* `render(state?: Partial<T> & IFormState): HTMLFormElement` — отображает форму.
* `onSubmit(): void` — обработчик отправки формы, переопределяется в наследниках.

### События

* `form:change` — изменение значения поля формы.

## Класс `OrderForm`

Первая форма оформления заказа.

### Наследование

`OrderForm extends Form<IOrderForm>`

### Конструктор

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

### Поля

* `cardButton: HTMLButtonElement` — кнопка оплаты картой.
* `cashButton: HTMLButtonElement` — кнопка оплаты наличными.
* `addressInput: HTMLInputElement` — поле адреса.

### Методы

* `set payment(value: TPayment)` — устанавливает выбранный способ оплаты.
* `set address(value: string)` — устанавливает адрес доставки.
* `render(state?: Partial<IOrderForm> & IFormState): HTMLFormElement` — отображает форму заказа.
* `onSubmit(): void` — генерирует событие перехода ко второму шагу.

### События

* `order:submit` — переход ко второму шагу оформления.

## Класс `ContactsForm`

Вторая форма оформления заказа.

### Наследование

`ContactsForm extends Form<IContactsForm>`

### Конструктор

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

### Поля

* `emailInput: HTMLInputElement` — поле email.
* `phoneInput: HTMLInputElement` — поле телефона.

### Методы

* `set email(value: string)` — устанавливает email.
* `set phone(value: string)` — устанавливает телефон.
* `render(state?: Partial<IContactsForm> & IFormState): HTMLFormElement` — отображает форму контактов.
* `onSubmit(): void` — генерирует событие завершения оформления.

### События

* `contacts:submit` — завершение оформления заказа.

## Класс `Success`

Компонент успешного оформления заказа.

### Наследование

`Success extends Component<ISuccess>`

### Конструктор

```ts
constructor(container: HTMLElement, actions: ISuccessActions)
```

### Поля

* `closeButton: HTMLButtonElement` — кнопка закрытия сообщения.
* `descriptionElement: HTMLElement` — элемент с итоговой суммой.

### Методы

* `set total(value: number)` — отображает сумму заказа.
* `render(data: ISuccess): HTMLElement` — отображает сообщение об успешном заказе.

## События приложения

### События моделей

* `products:changed` — обновлён каталог товаров.
* `preview:changed` — изменён товар в превью.
* `basket:changed` — изменена корзина.
* `buyer:changed` — изменены данные покупателя.

### События представлений

* `card:select` — выбран товар в каталоге.
* `basket:open` — открыть корзину.
* `basket:item-remove` — удалить товар из корзины.
* `product:toggle-basket` — добавить или удалить товар из корзины.
* `order:open` — открыть оформление заказа.
* `order:submit` — перейти ко второму шагу оформления.
* `contacts:submit` — завершить оформление заказа.
* `form:change` — изменить поле формы.
* `modal:open` — открыть модальное окно.
* `modal:close` — закрыть модальное окно.

## Презентер

Презентер реализован в файле `src/main.ts`.

Он выполняет следующие задачи:

* создаёт экземпляры API, моделей и представлений;
* загружает товары с сервера;
* подписывается на события моделей и представлений;
* синхронизирует каталог, превью, корзину и формы;
* открывает модальные окна;
* формирует объект заказа;
* отправляет заказ на сервер;
* очищает корзину и данные покупателя после успешного оформления.
