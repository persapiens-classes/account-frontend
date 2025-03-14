import { Bean } from "../bean/bean";

export class Category implements Bean<string> {
  constructor(public description: string) { }

  getId(): string {
    return this.description
  }
}
