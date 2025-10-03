import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { NEW_LEAD_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.newLead,
  namePlural: 'newLeads',
  labelSingular: msg`New Lead`,
  labelPlural: msg`New Leads`,
  description: msg`A new lead`,
  icon: STANDARD_OBJECT_ICONS.newLead,
  labelIdentifierStandardId: NEW_LEAD_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsNotAuditLogged()
export class NewLeadWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Lead name`,
    icon: 'IconUser',
  })
  name: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.phoneNumber,
    type: FieldMetadataType.TEXT,
    label: msg`Phone Number`,
    description: msg`Lead phone number`,
    icon: 'IconPhone',
  })
  phoneNumber: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.email,
    type: FieldMetadataType.TEXT,
    label: msg`Email`,
    description: msg`Lead email`,
    icon: 'IconMail',
  })
  email: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.country,
    type: FieldMetadataType.TEXT,
    label: msg`Country`,
    description: msg`Lead country`,
    icon: 'IconWorld',
  })
  country: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.companyName,
    type: FieldMetadataType.TEXT,
    label: msg`Company Name`,
    description: msg`Lead company name`,
    icon: 'IconBuildingSkyscraper',
  })
  companyName: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.website,
    type: FieldMetadataType.TEXT,
    label: msg`Website`,
    description: msg`Lead website`,
    icon: 'IconLink',
  })
  website: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.stage,
    type: FieldMetadataType.SELECT,
    label: msg`Stage`,
    description: msg`Lead stage`,
    icon: 'IconProgressCheck',
    options: [
      {
        value: 'WAITING_FOR_APPROVAL',
        label: 'Waiting for approval',
        position: 0,
        color: 'yellow',
      },
      {
        value: 'APPROVED',
        label: 'Approved',
        position: 1,
        color: 'green',
      },
      {
        value: 'UNAPPROVED',
        label: 'Unapproved',
        position: 2,
        color: 'red',
      },
    ],
    defaultValue: "'WAITING_FOR_APPROVAL'",
  })
  @WorkspaceFieldIndex()
  stage: string;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: NEW_LEAD_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`New Lead record position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;
}
