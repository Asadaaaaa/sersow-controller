class ProfileValidator {

  // --- Update Profile Scheme
  updateProfile = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 60,
        minLength: 1,
        pattern: '^[a-zA-Z]+(?:\\s[a-zA-Z]+)*$',
        nullable: false
      },
      bio: {
        type: 'string',
        maxLength: 160,
        minLength: 1,
        nullable: true
      },
      image: {
        type: 'string',
        nullable: true
      },
      website: {
        type: 'string',
        maxLength: 50,
        minLength: 1,
        nullable: true
      }
    },
    required: ['name', 'bio', 'website'],
    additionalProperties: false
  };

  // --- Update Username Scheme
  updateUsername = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        maxLength: 1,
        minLength: 15,
        pattern: '^[a-zA-Z0-9_]{1,15}$',
        nullable: false
      }
    }
  };
}

export default ProfileValidator;