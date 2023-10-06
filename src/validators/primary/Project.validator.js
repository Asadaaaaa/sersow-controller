class ProjectValidator {

  // --- Project Scheme
  project = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        maxLength: 36,
        minLength: 36,
        nullable: true
      },
      title: {
        type: 'string',
        maxLength: 25,
        minLength: 1,
        nullable: false
      },
      description: {
        type: 'string',
        maxLength: 700,
        minLength: 1,
        nullable: true
      },
      categories: {
        type: 'array',
        maxItems: 3,
        items: {
          type: "string",
          maxLength: 36,
          minLength: 36,
          pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
          nullable: false
        },
        nullable: true
      },
      otherCtg: {
        type: 'string',
        maxLength: 30,
        minLength: 1,
        nullable: true
      },
      logo: {
        type: 'string',
        nullable: true
      },
      thumbnail: {
        type: 'object',
        nullable: true,
        properties: {
          isUrl: {
            type: 'boolean',
            nullable: false
          },
          data: {
            type: 'string',
            nullable: false,
            if: {
              properties: {
                isUrl: {
                  const: true
                }
              },
              type: 'object'
            },
            then: {
              maxLength: 50,
              minLength: 11,
              pattern: '^(?:https?:\\/\\/(?:www\\.)?youtube\\.com\\/(?:watch\\?v=|embed\\/)?[\\w-]{11}|https?:\\/\\/youtu\\.be\\/[\\w-]{11})$'
            },
            else: {
              pattern: '^[A-Za-z0-9+/=]+$'
            }
          },
        },
        required: ['isUrl', 'data'],
        additionalProperties: false
      },
      image1: {
        type: 'string',
        nullable: true
      },
      image2: {
        type: 'string',
        nullable: true
      },
      image3: {
        type: 'string',
        nullable: true
      },
      program: {
        type: 'object',
        nullable: true,
        properties: {
          isUrl: {
            type: 'boolean',
            nullable: false
          },
          data: {
            type: 'string',
            nullable: false
          }
        },
        required: ['isUrl', 'data'],
        additionalProperties: false
      },
      paper: {
        type: 'object',
        nullable: true,
        properties: {
          isUrl: {
            type: 'boolean',
            nullable: false
          },
          data: {
            type: 'string',
            nullable: false
          }
        },
        required: ['isUrl', 'data'],
        additionalProperties: false
      },
      code: {
        type: 'object',
        nullable: true,
        properties: {
          isUrl: {
            type: 'boolean',
            nullable: false
          },
          data: {
            type: 'string',
            nullable: false
          }
        },
        required: ['isUrl', 'data'],
        additionalProperties: false
      },
      tags: {
        type: 'array',
        maxItems: 4,
        nullable: true,
        items: {
          type: 'string',
          maxLength: 12,
          pattern: '^[a-z0-9]{1,12}$',
          nullable: false
        }
      },
      contributors: {
        type: 'array',
        nullable: true,
        items: {
          type: 'string',
          pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
          nullable: false
        }
      }
    },
    required: [
      'id', 'title', 'description', 'categories', 'otherCtg', 
      'logo', 'thumbnail', 'image1', 'image2', 'image3', 
      'program', 'paper', 'code', 'tags', 'contributors'
    ],
    additionalProperties: false
  }
}

export default ProjectValidator;
