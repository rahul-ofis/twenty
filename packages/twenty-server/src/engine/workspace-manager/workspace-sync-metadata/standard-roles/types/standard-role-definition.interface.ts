import { type FlatRole } from 'src/engine/metadata-modules/flat-role/types/flat-role.type';
import { type PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';

export type StandardObjectPermissionDefinition = {
  objectStandardId: string;
  canReadObjectRecords: boolean;
  canUpdateObjectRecords: boolean;
  canSoftDeleteObjectRecords: boolean;
  canDestroyObjectRecords: boolean;
};

export type StandardFieldPermissionDefinition = {
  objectStandardId: string;
  fieldStandardId: string;
  canReadFieldValue?: boolean | null;
  canUpdateFieldValue?: boolean | null;
};

export type StandardRoleDefinition = Omit<
  FlatRole,
  'id' | 'workspaceId' | 'universalIdentifier' | 'standardId'
> & {
  standardId: string;
  permissionFlags?: PermissionFlagType[];
  objectPermissions?: StandardObjectPermissionDefinition[];
  fieldPermissions?: StandardFieldPermissionDefinition[];
};
