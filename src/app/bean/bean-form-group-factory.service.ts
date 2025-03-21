import { Injectable, Injector, Type } from "@angular/core";
import { Bean } from "./bean";
import { FormGroup } from "@angular/forms";
import { BeanFormGroupService } from "./bean-form-group.service";

@Injectable({
  providedIn: 'root'
})
export class BeanFormGroupServiceFactory {

  private form!: FormGroup;

  constructor(private injector: Injector) {
  }

  public getBeanFormGroupService<T extends BeanFormGroupService<B>, B extends Bean>(type: Type<T>): T {
    return this.injector.get<T>(type)
  }
}
