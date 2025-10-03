import { ADMIN_ROLE } from './roles/admin-role';
import { EMPLOYEE_ROLE } from './roles/employee-role';
import { MANAGER_ROLE } from './roles/manager-role';
import { WORKFLOW_MANAGER_ROLE } from './roles/workflow-manager-role';
import { type StandardRoleDefinition } from './types/standard-role-definition.interface';

export const standardRoleDefinitions = [
  ADMIN_ROLE,
  WORKFLOW_MANAGER_ROLE,
  EMPLOYEE_ROLE,
  MANAGER_ROLE,
] as const satisfies StandardRoleDefinition[];
