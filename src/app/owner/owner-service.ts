import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { createOwner, Owner } from "./owner";
import { BeanService } from "../bean/bean-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerService extends BeanService<Owner, Owner, Owner> {

  constructor(http: HttpClient) {
    super(http, "Owner", "owners", createOwner)
  }

}
