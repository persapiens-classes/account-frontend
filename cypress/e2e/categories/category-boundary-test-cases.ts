export interface DescriptionBoundaryTestCase {
  description: string;
  expectedStatus: number;
}

export type DescriptionBoundaryTestCases = Record<string, DescriptionBoundaryTestCase>;

export const categoryDescriptionBoundaryTestCases: DescriptionBoundaryTestCases = {
  'OW-01': {
    description: '   ', // Only whitespace
    expectedStatus: 400,
  },
  'OW-02': {
    description: 'abc', // 3 characters (lower limit)
    expectedStatus: 201,
  },
  'OW-03': {
    description: 'a'.repeat(255), // 255 characters (upper limit)
    expectedStatus: 201,
  },
  'OW-04': {
    description: 'a'.repeat(256), // 256 characters (exceeds upper limit)
    expectedStatus: 400,
  },
};
