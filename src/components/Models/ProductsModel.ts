import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit('products:changed');
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit('preview:changed', item);
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}