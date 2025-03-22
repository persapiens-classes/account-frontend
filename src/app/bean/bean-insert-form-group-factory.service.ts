import { Injectable, Injector, Type } from "@angular/core";
import { Bean } from "./bean";
import { BeanInsertFormGroupService } from "./bean-insert-form-group.service";

@Injectable({
  providedIn: 'root'
})
export class BeanInsertFormGroupServiceFactory {

  constructor(private injector: Injector) {
  }

  public getBeanInsertFormGroupService<B extends BeanInsertFormGroupService<T>, T extends Bean>(type: Type<B>): B {
    return this.injector.get<B>(type)
  }
}
