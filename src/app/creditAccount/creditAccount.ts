import { Bean } from "../bean/bean";

export class CreditAccount implements Bean<string> {
  constructor(public description: string, public category: string) { }

  getId(): string {
    return this.description
  }
}
