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
}

export default SettingsValidator;