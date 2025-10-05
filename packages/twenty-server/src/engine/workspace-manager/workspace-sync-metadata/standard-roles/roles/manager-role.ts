import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { type StandardRoleDefinition } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-roles/types/standard-role-definition.interface';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const MANAGER_ROLE: StandardRoleDefinition = {
  standardId: '20202020-0001-0001-0001-000000000004',
  label: 'Manager',
  description: 'Role for managers with full access to records',
  icon: 'IconUserStar',
  isEditable: true,
  canUpdateAllSettings: false,
  canAccessAllTools: false,
  canReadAllObjectRecords: true, // Can see all records across all objects
  canUpdateAllObjectRecords: true, // Can edit all records across all objects
  canSoftDeleteAllObjectRecords: true, // Can soft delete records
  canDestroyAllObjectRecords: false,
  canBeAssignedToUsers: true,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  permissionFlags: [
    PermissionFlagType.SEND_EMAIL_TOOL,
    PermissionFlagType.IMPORT_CSV,
    PermissionFlagType.EXPORT_CSV,
  ],
  objectPermissions: [
    {
      objectStandardId: STANDARD_OBJECT_IDS.team,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ], // Restrict team modifications while allowing read access
  fieldPermissions: [], // No field restrictions - Manager can edit all fields including stage
};
