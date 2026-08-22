import { Observable } from 'rxjs';

export interface MinimalModel {
  id: string;
  data: string;
}

export interface ValidModelType {
  title: string;
}

export class ValidModel implements ValidModelType {
  constructor(
    public id = '',
    public title = '',
  ) {}
}

export function expectObservableValue<T>(
  observable: Observable<T>,
  assertResult: (value: T) => void,
): Promise<void> {
  return new Promise<void>((resolve) => {
    observable.subscribe((value) => {
      assertResult(value);
      resolve();
    });
  });
}
