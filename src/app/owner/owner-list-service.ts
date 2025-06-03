import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { BeanListService } from "../bean/bean-list-service";
import { OwnerCreateService } from "./owner-create-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerListService extends BeanListService<Owner> {

  constructor(http: HttpClient) {
    super(http, "owners", new OwnerCreateService())
  }

}

export const OWNER_LIST_SERVICE = new InjectionToken<OwnerListService>('OwnerListService')
