import { BeanCreateService } from '../bean/bean-create-service';
import { Injectable } from '@angular/core';
import { Category, createCategory } from './category';

@Injectable({
  providedIn: 'root',
})
export class CategoryCreateService extends BeanCreateService<Category> {
  constructor() {
    super(createCategory);
  }
}
