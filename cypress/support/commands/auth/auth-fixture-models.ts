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
}
