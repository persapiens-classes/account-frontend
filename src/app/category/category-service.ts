import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Category, createCategory } from "./category";

export class CategoryService extends BeanService<Category, Category, Category> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Category`, `${type.toLowerCase()}Categories`, createCategory)
  }

}
