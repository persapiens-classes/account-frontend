import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { BeanService } from "../bean/bean-service";
import { OwnerCreateService } from "./owner-create-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerService extends BeanService<Owner, Owner, Owner> {

  constructor(http: HttpClient) {
    super(http, "Owner", "owners", new OwnerCreateService())
  }

}

export const OWNER_SERVICE = new InjectionToken<OwnerService>('OwnerService')
