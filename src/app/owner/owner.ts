export interface Owner {
  name: string;
}

export function ownerId(owner: Owner): string {
  return owner.name;
}

export function createOwner(): Owner {
  return {
    name: '',
  };
}
