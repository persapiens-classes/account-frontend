import { HttpClient } from '@angular/common/http';
import { vi } from 'vitest';

type HttpClientMethodName =
  'post' | 'get' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'request';

export type HttpClientTestMock = Record<HttpClientMethodName, ReturnType<typeof vi.fn>>;

export function createHttpClientTestMock(overrides: Partial<HttpClientTestMock> = {}): HttpClient {
  const mock: HttpClientTestMock = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    request: vi.fn(),
    ...overrides,
  };

  return mock as unknown as HttpClient;
}
