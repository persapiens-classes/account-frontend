import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import z, { ZodType } from 'zod';
import { OwnerSchema } from '../owner/owner';
import { CategorySchema } from '../category/category';
import { AccountSchema } from '../account/account';
import { EntrySchema } from '../entry/entry';
import { BalanceSchema } from '../owner-equity-account-initial-value/balance';
import { OwnerEquityAccountInitialValueSchema } from '../owner-equity-account-initial-value/owner-equity-account-initial-value';
import { safeModelWithZod } from './models';

const schemaCache = new Map<string, ZodType>([
  ['owners', OwnerSchema],
  ['Categories', CategorySchema],
  ['Accounts', AccountSchema],
  ['Entries', EntrySchema],
  ['balances', BalanceSchema],
  ['ownerEquityAccountInitialValues', OwnerEquityAccountInitialValueSchema],
]);

function getSchemaForUrl(url: string): ZodType | null {
  for (const [pattern, schema] of schemaCache) {
    if (url.includes(pattern)) {
      return schema;
    }
  }
  return null;
}

export const modelValidationInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. filter schema
  const baseSchema = getSchemaForUrl(req.url);
  if (!baseSchema) {
    return next(req); // no overhead
  }

  // 2. Apply validation only when necessary
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        let schemaToUse: ZodType = baseSchema;

        if (Array.isArray(event.body)) {
          schemaToUse = z.array(baseSchema);
        }
        const validated = safeModelWithZod(event.body, schemaToUse);
        return event.clone({ body: validated });
      }
      return event;
    }),
  );
};
