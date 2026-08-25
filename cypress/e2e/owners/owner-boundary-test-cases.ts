export interface NameBoundaryTestCase {
  name: string;
  expectedStatus: number;
  description: string;
}

export interface NameBoundaryTestCases {
  [key: string]: NameBoundaryTestCase;
}

export const ownerNameBoundaryTestCases: NameBoundaryTestCases = {
  'OW-01': {
    name: '   ', // Only whitespace
    expectedStatus: 400,
    description: 'name containing only whitespace',
  },
  'OW-02': {
    name: 'abc', // 3 characters (lower limit)
    expectedStatus: 201,
    description: 'name with 3 characters (lower limit)',
  },
  'OW-03': {
    name: 'a'.repeat(255), // 255 characters (upper limit)
    expectedStatus: 201,
    description: 'name with 255 characters (upper limit)',
  },
  'OW-04': {
    name: 'a'.repeat(256), // 256 characters (exceeds upper limit)
    expectedStatus: 400,
    description: 'name exceeding 255 characters (exceeds upper limit)',
  },
};
