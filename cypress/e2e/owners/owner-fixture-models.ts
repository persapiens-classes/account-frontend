import { Owner } from '../../../src/app/owner/owner';

export interface BoundaryTestCase {
  name: string;
  expectedStatus: number;
  description: string;
}

export interface OwnersData {
  owners: {
    list: Owner[];
  };
  owner: {
    create: Owner;
    update: Owner;
  };
  boundaryValues: Record<string, BoundaryTestCase>;
}
