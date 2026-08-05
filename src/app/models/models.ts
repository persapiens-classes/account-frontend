export function toModel<T>(json: T, jsonToModelFn: (t: T) => T = defaultJsonToModel): T {
  return jsonToModelFn(json);
}

export function defaultJsonToModel<T>(result: T): T {
  return result;
}

export function toModelFromHistory<T>(jsonToModelFn: (t: T) => T = defaultJsonToModel): T {
  return toModel(history.state.model, jsonToModelFn);
}
