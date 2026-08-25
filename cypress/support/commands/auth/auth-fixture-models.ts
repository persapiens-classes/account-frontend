import { Balance } from '../../../../src/app/owner-equity-account-initial-value/balance';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthData {
  login: {
    success: {
      login: string;
      token: string;
      expiresIn: number;
    };
    invalid: {
      message: string;
      statusCode: number;
    };
  };
  credentials: {
    valid: Credentials;
    invalid: Credentials;
  };
  balances: {
    list: Balance[];
  };
}
