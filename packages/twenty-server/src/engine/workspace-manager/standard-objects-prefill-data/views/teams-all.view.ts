import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  TEAM_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';

export const teamsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const teamObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.team,
  );

  if (!teamObjectMetadata) {
    throw new Error('Team object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Teams',
    objectMetadataId: teamObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconUsers',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      // Primary identifier and owner
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.manager,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },

      // Description and status
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.isActive,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },

      // Related counts
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.employees,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.leads,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },

      // Audit info
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) => field.standardId === TEAM_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.updatedAt,
          )?.id ?? '',
        position: 8,
        isVisible: true,
        size: 150,
      },
    ],
  };
};
