import { Injectable, InjectionToken } from "@angular/core";
import { Owner } from "./owner";
import { OwnerCreateService } from "./owner-create-service";
import { BeanDetailService } from "../bean/bean-detail-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerDetailService extends BeanDetailService<Owner> {

  constructor() {
    super("owners", new OwnerCreateService())
  }

}

export const OWNER_DETAIL_SERVICE = new InjectionToken<OwnerDetailService>('OwnerDetailService')
