import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BeanService } from "./bean-service";
import { Category } from "./category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BeanService <Category, string> {
  
  constructor(http: HttpClient) {
    super(http, "Category", "categories", createBean)
  }
  
}

function createBean(): Category {
  return new Category('')
}