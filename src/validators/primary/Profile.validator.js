class ProfileValidator {
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
      username: {
        type: 'string',
        maxLength: 15,
        minLength: 1,
        pattern: '^[a-zA-Z0-9_]{1,15}$',
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
      }
    },
    required: ['name', 'username', 'bio', 'image'],
    additionalProperties: false
  };
}

export default ProfileValidator;