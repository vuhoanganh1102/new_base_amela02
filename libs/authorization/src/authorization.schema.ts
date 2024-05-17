import { ApiBodyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */

export const addRoleSchema: SchemaObject = {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const updateRoleSchema: SchemaObject = {
  type: 'object',
  required: ['name'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
  },
};

export const updateUserPermissionSchema: SchemaObject = {
  type: 'object',
  required: [],
  additionalProperties: false,
  properties: {
    permissions: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'integer',
        minimum: 1,
      },
    },
  },
};

export const updateRolePermissionsSchema: SchemaObject = {
  type: 'object',
  required: ['permissions', 'changeUserPermission'],
  additionalProperties: false,
  properties: {
    permissions: {
      type: 'array',
      items: {
        type: 'number',
        minimum: 1,
        maximum: 998,
      },
      minItems: 0,
    },
    changeUserPermission: {
      enum: [0, 1],
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
      data: null,
    },
  },
};

export const listPermissionExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: [
        {
          id: 1,
          name: 'PERMISSION_MANAGEMENT',
          permissionGroupId: 1,
        },
        {
          id: 2,
          name: 'CONFIG_MANAGEMENT',
          permissionGroupId: 1,
        },
        {
          id: 3,
          name: 'RESOURCE_MANAGEMENT',
          permissionGroupId: 1,
        },
        {
          id: 4,
          name: 'LANGUAGE_MANAGEMENT',
          permissionGroupId: 1,
        },
      ],
    },
  },
};

export const listRoleExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: [
        {
          id: 1,
          name: 'Role 1',
          isSystem: 0,
          isVisible: 1,
        },
        {
          id: 2,
          name: 'Role 2',
          isSystem: 0,
          isVisible: 1,
        },
      ],
    },
  },
};

export const addRoleExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: {
        id: 1,
        name: 'Role 1',
        isSystem: 0,
        isVisible: 1,
      },
    },
  },
};

export const listUserPermissionExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: {
        'Common Permission': [
          {
            id: 1,
            name: 'PERMISSION_MANAGEMENT',
            permissionGroupId: 1,
            hasPermission: 0,
          },
          {
            id: 2,
            name: 'CONFIG_MANAGEMENT',
            permissionGroupId: 1,
            hasPermission: 0,
          },
          {
            id: 3,
            name: 'RESOURCE_MANAGEMENT',
            permissionGroupId: 1,
            hasPermission: 0,
          },
          {
            id: 4,
            name: 'LANGUAGE_MANAGEMENT',
            permissionGroupId: 1,
            hasPermission: 0,
          },
        ],
      },
    },
  },
};

export const listRolePermissionExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: null,
    },
  },
};

export const userPermissionExampleResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response data example',
  schema: {
    example: {
      data: null,
    },
  },
};
/* -------------------------------------------------------------------------- */
/*                                   ApiBody                                  */
/* -------------------------------------------------------------------------- */

export const addRoleApiBody: ApiBodyOptions = {
  schema: addRoleSchema,
  description: 'Api Add Role',
  examples: { exampleResponse },
};

export const updateRoleApiBody: ApiBodyOptions = {
  schema: updateRoleSchema,
  description: 'Api Update Role',
  examples: { exampleResponse },
};

export const hiddenRoleApiBody: ApiBodyOptions = {
  description: 'Api Hidden Role',
  examples: { exampleResponse },
};

export const updateRolePermissionApiBody: ApiBodyOptions = {
  schema: updateRolePermissionsSchema,
  description: 'Api Update Role Permission',
  examples: { exampleResponse },
};

export const updateUserPermissionApiBody: ApiBodyOptions = {
  schema: updateUserPermissionSchema,
  description: 'Api Update  User Permission',
  examples: { exampleResponse },
};
