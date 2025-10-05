import { type EntityManager } from 'typeorm';

import { FieldActorSource } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import {
  TEAM_ALPHA_ID,
  TEAM_BETA_ID,
  TEAM_DELTA_ID,
  TEAM_GAMMA_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-teams';

export const prefillNewLeads = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.newLead`, [
      'name',
      'phoneNumber',
      'email',
      'country',
      'companyName',
      'website',
      'stage',
      'teamId',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
    ])
    .orIgnore()
    .values([
      {
        name: 'John Smith',
        phoneNumber: '+1-555-0123',
        email: 'john.smith@techcorp.com',
        country: 'United States',
        companyName: 'TechCorp Solutions',
        website: 'https://techcorp.com',
        stage: 'WAITING_FOR_APPROVAL',
        teamId: TEAM_ALPHA_ID,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        name: 'Emma Johnson',
        phoneNumber: '+44-20-7123-4567',
        email: 'emma.johnson@innovateuk.co.uk',
        country: 'United Kingdom',
        companyName: 'Innovate UK Ltd',
        website: 'https://innovateuk.co.uk',
        stage: 'APPROVED',
        teamId: TEAM_BETA_ID,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        name: 'Michael Chen',
        phoneNumber: '+86-10-8888-9999',
        email: 'michael.chen@dragontech.cn',
        country: 'China',
        companyName: 'Dragon Tech Industries',
        website: 'https://dragontech.cn',
        stage: 'APPROVED',
        teamId: TEAM_GAMMA_ID,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        name: 'Sofia Rodriguez',
        phoneNumber: '+34-91-123-4567',
        email: 'sofia.rodriguez@iberiadigital.es',
        country: 'Spain',
        companyName: 'Iberia Digital',
        website: 'https://iberiadigital.es',
        stage: 'UNAPPROVED',
        teamId: TEAM_DELTA_ID,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        name: 'Raj Patel',
        phoneNumber: '+91-22-1234-5678',
        email: 'raj.patel@mumbaiventures.in',
        country: 'India',
        companyName: 'Mumbai Ventures Pvt Ltd',
        website: 'https://mumbaiventures.in',
        stage: 'APPROVED',
        teamId: TEAM_ALPHA_ID,
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
