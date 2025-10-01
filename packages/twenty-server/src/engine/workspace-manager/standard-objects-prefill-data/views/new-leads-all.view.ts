/* eslint-disable prettier/prettier */
import { msg } from '@lingui/core/macro';

import { AggregateOperations } from 'src/engine/api/graphql/graphql-query-runner/constants/aggregate-operations.constant';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';
import {
    BASE_OBJECT_STANDARD_FIELD_IDS,
    NEW_LEAD_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const newLeadsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const newLeadObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.newLead,
  );

  if (!newLeadObjectMetadata) {
    throw new Error('New Lead object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All New Leads',
    objectMetadataId: newLeadObjectMetadata.id ?? '',
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconUserPlus',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) => field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) => field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.email,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
        aggregateOperation: AggregateOperations.COUNT,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) =>
              field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.phoneNumber,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) =>
              field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.companyName,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) => field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.country,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 130,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) => field.standardId === NEW_LEAD_STANDARD_FIELD_IDS.website,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 170,
        aggregateOperation: AggregateOperations.PERCENTAGE_EMPTY,
      },
      {
        fieldMetadataId:
          newLeadObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};
