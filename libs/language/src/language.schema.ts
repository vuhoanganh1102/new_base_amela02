import { ApiBodyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */
export const addLanguageSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    code: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    status: {
      type: 'integer',
    },
    viName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    priority: {
      type: 'integer',
    },
    flagIcon: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    isDefault: {
      type: 'integer',
    },
  },
};

export const updateLanguageSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    code: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    status: {
      type: 'integer',
    },
    viName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    priority: {
      type: 'integer',
    },
    flagIcon: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    isDefault: {
      type: 'integer',
      default: 1,
    },
  },
};

export const addLanguageKeySchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    key: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    defaultValue: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    environment: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    translations: {
      type: 'array',
      items: {
        properties: {
          code: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
          },
          value: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
          },
          environment: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
          key: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
        },
      },
    },
  },
};

export const updateLanguageKeySchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    key: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    defaultValue: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    environment: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    translations: {
      type: 'array',
      items: {
        properties: {
          code: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
          },
          value: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
          },
          environment: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
          key: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
        },
      },
    },
  },
};

export const updateFileLanguageSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    environment: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    code: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
    languages: {
      type: 'string',
      minLength: 1,
      maxLength: 500,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                          Response Example                                  */
/* -------------------------------------------------------------------------- */

export const exampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getLanguageInfoExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getListLanguageResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const listLanguageKeyResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getFileLanguageExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const listEnvironmentsExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                   ApiBody                                  */
/* -------------------------------------------------------------------------- */

export const addLanguageApiBody: ApiBodyOptions = {
  schema: addLanguageSchema,
  description: 'Api Add Language ',
  examples: { exampleResponse },
};

export const updateLanguageApiBody: ApiBodyOptions = {
  schema: updateLanguageSchema,
  description: 'Api Update Language',
  examples: { exampleResponse },
};

export const addLanguageKeyApiBody: ApiBodyOptions = {
  schema: addLanguageKeySchema,
  description: 'Api Add Language Key',
  examples: { exampleResponse },
};

export const updateLanguageKeyApiBody: ApiBodyOptions = {
  schema: updateLanguageKeySchema,
  description: 'Api Update Language Key',
  examples: { exampleResponse },
};

export const updateFileLanguageApiBody: ApiBodyOptions = {
  schema: updateFileLanguageSchema,
  description: 'Api Update File Language',
  examples: { exampleResponse },
};
