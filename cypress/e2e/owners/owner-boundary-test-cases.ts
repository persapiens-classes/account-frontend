export interface NameBoundaryTestCase {
  name: string;
  expectedStatus: number;
}

export type NameBoundaryTestCases = Record<string, NameBoundaryTestCase>;

export const ownerNameBoundaryTestCases: NameBoundaryTestCases = {
  'OW-01': {
    name: '   ', // Only whitespace
    expectedStatus: 400,
  },
  'OW-02': {
    name: 'abc', // 3 characters (lower limit)
    expectedStatus: 201,
  },
  'OW-03': {
    name: 'a'.repeat(255), // 255 characters (upper limit)
    expectedStatus: 201,
  },
  'OW-04': {
    name: 'a'.repeat(256), // 256 characters (exceeds upper limit)
    expectedStatus: 400,
  },
};
