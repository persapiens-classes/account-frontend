import { BeanCreateService } from "../bean/bean-create-service";
import { createOwnerEquityAccountInitialValue, OwnerEquityAccountInitialValue } from "./owner-equity-account-initial-value";

export class OwnerEquityAccountInitialValueCreateService extends BeanCreateService<OwnerEquityAccountInitialValue> {

  constructor() {
    super(createOwnerEquityAccountInitialValue)
  }

}
