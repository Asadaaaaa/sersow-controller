class SettingsValidator {

  // --- Update Username Scheme
  accountUpdateUsername = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        maxLength: 15,
        minLength: 1,
        pattern: '^[a-zA-Z0-9_]{1,15}$',
        nullable: false
      }
    }
  };

  accountUpdateEmail = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        maxLength: 40,
        minLength: 6,
        pattern: '^[A-Za-z0-9._%+-]+@gmail\\.com$',
        nullable: false
      }
    }
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

}

export default SettingsValidator;