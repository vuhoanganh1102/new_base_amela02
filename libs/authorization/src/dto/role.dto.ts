export class AddRoleDto {
    name:string
  }

  export class UpdateRoleDto {
    name:string
  }

  export class UpdateRolePermissionDto {
    permissions:number[];
    changeUserPermission: 0|1
  }