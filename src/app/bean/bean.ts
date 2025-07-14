export interface Bean {
  getId(): string;
}

export function toBean<T extends Bean>(
  json: unknown,
  createBeanFn: () => T,
  jsonToBeanFn: (t: T) => T,
): T {
  return jsonToBeanFn(Object.assign(createBeanFn(), json));
}

function defaultJsonToBean<T extends Bean>(result: T): T {
  return result;
}

export function toBeanFromHistory<T extends Bean>(
  createBeanFn: () => T,
  jsonToBeanFn: (t: T) => T = defaultJsonToBean,
): T {
  return toBean(history.state.bean, createBeanFn, jsonToBeanFn);
}
