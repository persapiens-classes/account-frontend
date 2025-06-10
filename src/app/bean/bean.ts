export interface Bean {
  getId(): string;
}

export function toBean<T extends Bean>(
  json: unknown,
  createBeanFn: () => T,
  jsonToBean: (t: T) => T,
): T {
  return jsonToBean(Object.assign(createBeanFn(), json));
}

export function defaultJsonToBean<T extends Bean>(result: T): T {
  return result;
}
