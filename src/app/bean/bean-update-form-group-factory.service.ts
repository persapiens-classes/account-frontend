import { Injectable, Injector, Type } from "@angular/core";
import { Bean } from "./bean";
import { BeanUpdateFormGroupService } from "./bean-update-form-group.service";

@Injectable({
  providedIn: 'root'
})
export class BeanUpdateFormGroupServiceFactory {

  constructor(private injector: Injector) {
  }

  public getBeanUpdateFormGroupService<B extends BeanUpdateFormGroupService<T>, T extends Bean>(type: Type<B>): B {
    return this.injector.get<B>(type)
  }
}
