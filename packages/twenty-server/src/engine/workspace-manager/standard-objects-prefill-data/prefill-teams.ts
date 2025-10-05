import { type EntityManager } from 'typeorm';

import { FieldActorSource } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';

export const TEAM_ALPHA_ID = 'a1111111-1111-4a11-8111-111111111111';
export const TEAM_BETA_ID = 'b2222222-2222-4b22-8222-222222222222';
export const TEAM_GAMMA_ID = 'c3333333-3333-4c33-8333-333333333333';
export const TEAM_DELTA_ID = 'd4444444-4444-4d44-8444-444444444444';

export const prefillTeams = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.team`, [
      'id',
      'name',
      'description',
      'isActive',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
    ])
    .orIgnore()
    .values([
      {
        id: TEAM_ALPHA_ID,
        name: 'Sales Team Alpha',
        description: 'Primary sales team focusing on enterprise clients',
        isActive: true,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: TEAM_BETA_ID,
        name: 'Sales Team Beta',
        description: 'Secondary sales team focusing on mid-market clients',
        isActive: true,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: TEAM_GAMMA_ID,
        name: 'Marketing Team',
        description:
          'Team responsible for lead generation and marketing campaigns',
        isActive: true,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
      {
        id: TEAM_DELTA_ID,
        name: 'Support Team',
        description: 'Customer success and support team',
        isActive: true,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
