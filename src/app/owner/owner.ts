import { Bean } from "../bean/bean";

export class Owner implements Bean<string> {
  constructor(public name: string) { }
  getId(): string {
    return this.name
  }
}
