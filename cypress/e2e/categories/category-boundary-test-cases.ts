export type DescriptionBoundaryTestCases = Record<string, string>;

export const categoryDescriptionBoundaryTestCases: DescriptionBoundaryTestCases = {
  'OW-01': '   ', // Only whitespace
  'OW-02': 'abc', // 3 characters (lower limit)
  'OW-03': 'a'.repeat(255), // 255 characters (upper limit)
  'OW-04': 'a'.repeat(256), // 256 characters (exceeds upper limit)
};
