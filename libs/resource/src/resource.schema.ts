import { ApiBodyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */
export const listResourceSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    pageIndex: {
      type: 'integer',
      minimum: 1,
    },
    take: {
      type: 'integer',
      minimum: 1,
    },
    start: {
      type: 'integer',
    },
    skip: {
      type: 'integer',
    },
    sort: {
      type: 'string',
    },
    keyword: {
      type: 'string',
      maxLength: 250,
    },
    status: {
      type: 'string',
      enum: ['', '1', '0'],
    },
    type: {
      pattern: '^$|^\\d+$',
    },
  },
};

export const addResourceSchema: SchemaObject = {
  type: 'object',
  required: ['name', 'type'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    type: {
      type: 'number',
    },
    order: {
      type: 'number',
    },
    status: {
      type: 'number',
    },
    value: {
      type: 'string',
    },
  },
};

export const updateResourceSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    value: {
      type: 'string',
    },
    order: {
      type: 'integer',
    },
  },
};

export const updateStatusResourceSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    status: {
      type: 'number',
    },
  },
};

export const createResourceSingleSchema: SchemaObject = {
  type: 'object',
  required: ['type', 'value'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
    },
    value: {
      type: 'string',
    },
    type: {
      type: 'number',
    },
    order: {
      type: 'number',
    },
    status: {
      type: 'number',
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

export const getResourceInfoExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getListResourceExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getDetailResourceExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      // TODO example response
      data: null,
    },
  },
};

export const getResourceByTypeExampleResponse: ApiResponseOptions = {
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

export const createResourceApiBody: ApiBodyOptions = {
  schema: addResourceSchema,
  description: 'Api Create Resource ',
  examples: { exampleResponse },
};

export const updateResourceApiBody: ApiBodyOptions = {
  schema: updateResourceSchema,
  description: 'Api Update Resource ',
  examples: { exampleResponse },
};

export const updateStatusResourceApiBody: ApiBodyOptions = {
  schema: updateStatusResourceSchema,
  description: 'Api Update Status Resource ',
  examples: { exampleResponse },
};

export const createResourceSingleApiBody: ApiBodyOptions = {
  schema: createResourceSingleSchema,
  description: 'Api Create Resource Single',
  examples: { exampleResponse },
};
