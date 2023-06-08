class ActivityValidator {

  // --- Add Comment Project Scheme
  commentProject = {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        maxLength: 200,
        minLength: 1,
        pattern: '^[a-zA-Z0-9\\s`~!@#$%^&*()-_=+[\\]{}|;:\'",.<>/?\\\\]+$',
        nullable: false
      }
    }
  };
}

export default ActivityValidator;