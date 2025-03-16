import { HttpClient } from "@angular/common/http";
import { BeanService } from "../bean/bean-service";
import { Category } from "./category";

export class CategoryService extends BeanService<Category, string> {

  constructor(http: HttpClient, type: string) {
    super(http, `${type} Category`, `${type.toLowerCase()}Categories`, createBean)
  }

}

function createBean(): Category {
  return new Category('')
}