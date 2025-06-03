import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { BeanInsertService } from "../bean/bean-insert-service";
import { OwnerCreateService } from "./owner-create-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerInsertService extends BeanInsertService<Owner, Owner> {

  constructor(http: HttpClient) {
    super(http, "Owner", "owners", new OwnerCreateService())
  }

}

export const OWNER_INSERT_SERVICE = new InjectionToken<OwnerInsertService>('OwnerInsertService')
