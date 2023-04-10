class AuthScheme {
  register = {
    type: 'object',
    properties: {
      // username: {
      //   type: 'string',
      //   maxLength: 15,
      //   minLength: 1,
      //   pattern: '^[a-zA-Z0-9_]{1,15}$',
      //   nullable: false
      // },
      emailUpi: {
        type: 'string',
        maxLength: 68,
        minLength: 9,
        pattern: '^[A-Za-z0-9._%+-]+@upi\\.edu$',
        nullable: false
      },
      name: {
        type: 'string',
        maxLength: 60,
        minLength: 1,
        pattern: '^[a-zA-Z]+(?:\\s[a-zA-Z]+)*$',
        nullable: false
      },
      gender: {
        type: 'integer',
        enum: [1, 2],
        nullable: false
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 18,
        pattern: '^\\S+$',
        nullable: false
      }
    },
    required: ['emailUpi', 'name', 'gender', 'password'],
    additionalProperties: false
  };
  validCode = {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        minLength: 6,
        maxLength: 6,
        nullable: false
      }
    },
    required: ['code'],
    additionalProperties: false
  };
  login = {
    type: 'object',
    properties: {
      identity: {
        type: 'string',
        maxLength: 68,
        minLength: 1,
        nullable: false
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 18,
        nullable: false
      }
    },
    required: ['identity', 'password'],
    additionalProperties: false
  };
  reqForgetPassword = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        maxLength: 68,
        minLength: 1,
        pattern: '^[A-Za-z0-9._%+-]+@(upi\\.edu|gmail\\.com)$',
        nullable: false
      }
    },
    required: ['email'],
    additionalProperties: false
  };
}

export default AuthScheme;