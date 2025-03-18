import { Bean } from "../bean/bean";

export class Owner implements Bean<string> {
  constructor(public name: string) { }
  getId(): string {
    return this.name
  }
}

export function createOwner(): Owner {
  return new Owner('')
}