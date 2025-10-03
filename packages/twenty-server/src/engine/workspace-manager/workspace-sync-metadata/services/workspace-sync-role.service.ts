import { Injectable, Logger } from '@nestjs/common';

import { removePropertiesFromRecord } from 'twenty-shared/utils';
import { IsNull, Not, type EntityManager, type Repository } from 'typeorm';

import { ComparatorAction } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/comparator.interface';
import { type WorkspaceSyncContext } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/workspace-sync-context.interface';

import { fromRoleEntityToFlatRole } from 'src/engine/metadata-modules/flat-role/utils/from-role-entity-to-flat-role.util';
import { FieldPermissionEntity } from 'src/engine/metadata-modules/object-permission/field-permission/field-permission.entity';
import { ObjectPermissionEntity } from 'src/engine/metadata-modules/object-permission/object-permission.entity';
import { PermissionFlagEntity } from 'src/engine/metadata-modules/permission-flag/permission-flag.entity';
import { PermissionFlagType } from 'src/engine/metadata-modules/permissions/constants/permission-flag-type.constants';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { WorkspaceRoleComparator } from 'src/engine/workspace-manager/workspace-sync-metadata/comparators/workspace-role.comparator';
import { StandardRoleFactory } from 'src/engine/workspace-manager/workspace-sync-metadata/factories/standard-role.factory';
import { standardRoleDefinitions } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-roles';
import {
  type StandardFieldPermissionDefinition,
  type StandardObjectPermissionDefinition,
} from 'src/engine/workspace-manager/workspace-sync-metadata/standard-roles/types/standard-role-definition.interface';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';

@Injectable()
export class WorkspaceSyncRoleService {
  private readonly logger = new Logger(WorkspaceSyncRoleService.name);

  constructor(
    private readonly standardRoleFactory: StandardRoleFactory,
    private readonly workspaceRoleComparator: WorkspaceRoleComparator,
  ) {}

  async synchronize(
    context: WorkspaceSyncContext,
    manager: EntityManager,
  ): Promise<void> {
    this.logger.log('Syncing standard role metadata');

    const roleRepository = manager.getRepository(RoleEntity);
    const permissionFlagRepository =
      manager.getRepository(PermissionFlagEntity);
    const objectPermissionRepository = manager.getRepository(
      ObjectPermissionEntity,
    );
    const fieldPermissionRepository = manager.getRepository(
      FieldPermissionEntity,
    );
    const objectMetadataRepository =
      manager.getRepository(ObjectMetadataEntity);
    const fieldMetadataRepository = manager.getRepository(FieldMetadataEntity);

    const existingStandardRoleEntities = await roleRepository.find({
      where: {
        workspaceId: context.workspaceId,
        standardId: Not(IsNull()),
      },
      relations: ['permissionFlags'],
    });

    const targetStandardRoles = this.standardRoleFactory.create(
      standardRoleDefinitions,
      context,
      existingStandardRoleEntities,
    );

    const roleComparatorResults = this.workspaceRoleComparator.compare({
      fromFlatRoles: existingStandardRoleEntities.map(fromRoleEntityToFlatRole),
      toFlatRoles: targetStandardRoles,
    });

    for (const roleComparatorResult of roleComparatorResults) {
      switch (roleComparatorResult.action) {
        case ComparatorAction.CREATE: {
          const roleToCreate = roleComparatorResult.toFlatRole;

          const flatRoleData = removePropertiesFromRecord(roleToCreate, [
            'universalIdentifier',
            'id',
          ]);

          const createdRole = await roleRepository.save({
            ...flatRoleData,
            workspaceId: context.workspaceId,
          });

          const roleDefinition = standardRoleDefinitions.find(
            (def) => def.standardId === roleToCreate.standardId,
          );

          if (roleDefinition?.permissionFlags?.length) {
            await this.syncPermissionFlags(
              permissionFlagRepository,
              createdRole.id,
              context.workspaceId,
              roleDefinition.permissionFlags,
            );
          }

          if (roleDefinition?.objectPermissions?.length) {
            await this.syncObjectPermissions(
              objectPermissionRepository,
              objectMetadataRepository,
              createdRole.id,
              context.workspaceId,
              roleDefinition.objectPermissions,
            );
          }

          if (roleDefinition?.fieldPermissions?.length) {
            await this.syncFieldPermissions(
              fieldPermissionRepository,
              objectMetadataRepository,
              fieldMetadataRepository,
              createdRole.id,
              context.workspaceId,
              roleDefinition.fieldPermissions,
            );
          }
          break;
        }

        case ComparatorAction.UPDATE: {
          const roleToUpdate = roleComparatorResult.toFlatRole;

          const flatRoleData = removePropertiesFromRecord(roleToUpdate, [
            'id',
            'universalIdentifier',
            'workspaceId',
          ]);

          await roleRepository.update({ id: roleToUpdate.id }, flatRoleData);

          const roleDefinition = standardRoleDefinitions.find(
            (def) => def.standardId === roleToUpdate.standardId,
          );

          if (roleDefinition?.permissionFlags) {
            await this.syncPermissionFlags(
              permissionFlagRepository,
              roleToUpdate.id,
              context.workspaceId,
              roleDefinition.permissionFlags,
            );
          }

          if (roleDefinition?.objectPermissions) {
            await this.syncObjectPermissions(
              objectPermissionRepository,
              objectMetadataRepository,
              roleToUpdate.id,
              context.workspaceId,
              roleDefinition.objectPermissions,
            );
          }

          if (roleDefinition?.fieldPermissions) {
            await this.syncFieldPermissions(
              fieldPermissionRepository,
              objectMetadataRepository,
              fieldMetadataRepository,
              roleToUpdate.id,
              context.workspaceId,
              roleDefinition.fieldPermissions,
            );
          }
          break;
        }

        case ComparatorAction.DELETE: {
          const roleToDelete = roleComparatorResult.fromFlatRole;

          await roleRepository.delete({ id: roleToDelete.id });
          break;
        }
      }
    }
  }

  private async syncPermissionFlags(
    permissionFlagRepository: Repository<PermissionFlagEntity>,
    roleId: string,
    workspaceId: string,
    permissionFlags: PermissionFlagType[],
  ): Promise<void> {
    await permissionFlagRepository.delete({
      roleId,
      workspaceId,
    });

    if (permissionFlags.length > 0) {
      const newPermissionFlags = permissionFlags.map((flag) =>
        permissionFlagRepository.create({
          roleId,
          workspaceId,
          flag,
        }),
      );

      await permissionFlagRepository.save(newPermissionFlags);
    }
  }

  private async syncObjectPermissions(
    objectPermissionRepository: Repository<ObjectPermissionEntity>,
    objectMetadataRepository: Repository<ObjectMetadataEntity>,
    roleId: string,
    workspaceId: string,
    objectPermissions: StandardObjectPermissionDefinition[],
  ): Promise<void> {
    // Delete existing object permissions for this role
    await objectPermissionRepository.delete({
      roleId,
      workspaceId,
    });

    if (objectPermissions.length > 0) {
      const newObjectPermissions = [];

      for (const permission of objectPermissions) {
        const objectMetadata = await objectMetadataRepository.findOne({
          where: {
            standardId: permission.objectStandardId,
            workspaceId,
          },
        });

        if (objectMetadata) {
          newObjectPermissions.push(
            objectPermissionRepository.create({
              roleId,
              workspaceId,
              objectMetadataId: objectMetadata.id,
              canReadObjectRecords: permission.canReadObjectRecords,
              canUpdateObjectRecords: permission.canUpdateObjectRecords,
              canSoftDeleteObjectRecords: permission.canSoftDeleteObjectRecords,
              canDestroyObjectRecords: permission.canDestroyObjectRecords,
            }),
          );
        }
      }

      if (newObjectPermissions.length > 0) {
        await objectPermissionRepository.save(newObjectPermissions);
      }
    }
  }

  private async syncFieldPermissions(
    fieldPermissionRepository: Repository<FieldPermissionEntity>,
    objectMetadataRepository: Repository<ObjectMetadataEntity>,
    fieldMetadataRepository: Repository<FieldMetadataEntity>,
    roleId: string,
    workspaceId: string,
    fieldPermissions: StandardFieldPermissionDefinition[],
  ): Promise<void> {
    // Delete existing field permissions for this role
    await fieldPermissionRepository.delete({
      roleId,
      workspaceId,
    });

    if (fieldPermissions.length > 0) {
      const newFieldPermissions = [];

      for (const permission of fieldPermissions) {
        const objectMetadata = await objectMetadataRepository.findOne({
          where: {
            standardId: permission.objectStandardId,
            workspaceId,
          },
        });

        if (objectMetadata) {
          const fieldMetadata = await fieldMetadataRepository.findOne({
            where: {
              standardId: permission.fieldStandardId,
              objectMetadataId: objectMetadata.id,
            },
          });

          if (fieldMetadata) {
            newFieldPermissions.push(
              fieldPermissionRepository.create({
                roleId,
                workspaceId,
                objectMetadataId: objectMetadata.id,
                fieldMetadataId: fieldMetadata.id,
                canReadFieldValue: permission.canReadFieldValue,
                canUpdateFieldValue: permission.canUpdateFieldValue,
              }),
            );
          }
        }
      }

      if (newFieldPermissions.length > 0) {
        await fieldPermissionRepository.save(newFieldPermissions);
      }
    }
  }
}
