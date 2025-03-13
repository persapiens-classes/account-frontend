import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { BeanService } from "../bean/bean-service";

@Injectable({
  providedIn: 'root'
})
export class OwnerService extends BeanService <Owner, string> {

  constructor(http: HttpClient) {
    super(http, "Owner", "owners", createBean)
  }

}

function createBean(): Owner {
  return new Owner('')
}