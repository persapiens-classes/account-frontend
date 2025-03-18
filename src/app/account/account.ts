import { Bean } from "../bean/bean";

export class Account implements Bean {
  constructor(public description: string, public category: string) { }

  getId(): string {
    return this.description
  }
}

export function createAccount(): Account {
  return new Account('', '')
}