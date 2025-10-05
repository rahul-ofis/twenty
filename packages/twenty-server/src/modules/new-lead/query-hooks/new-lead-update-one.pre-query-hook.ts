import { Injectable } from '@nestjs/common';

import { isDefined } from 'class-validator';

import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type UpdateOneResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@Injectable()
@WorkspaceQueryHook(`newLead.updateOne`)
export class NewLeadUpdateOnePreQueryHook
  implements WorkspacePreQueryHookInstance
{
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async execute(
    authContext: AuthContext,
    objectName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: UpdateOneResolverArgs<Record<string, any>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<UpdateOneResolverArgs<Record<string, any>>> {
    const { workspaceMemberId, workspace } = authContext;

    // If no authenticated workspace member, return as-is
    if (!workspaceMemberId || !workspace) {
      return payload;
    }

    // Get current workspace member with team and manager info
    const workspaceMemberRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<WorkspaceMemberWorkspaceEntity>(
        workspace.id,
        'workspaceMember',
      );

    const workspaceMember = await workspaceMemberRepository.findOne({
      where: { id: workspaceMemberId },
      relations: ['team', 'team.manager'],
    });

    if (!workspaceMember) {
      return payload;
    }

    // Remove any attempts to manually update teamId or managerId
    // Then re-inject the correct values based on current user's team
    if (payload.data) {
      delete payload.data.teamId;
      delete payload.data.managerId;

      if (isDefined(workspaceMember.teamId)) {
        payload.data.teamId = workspaceMember.teamId;
      }

      if (workspaceMember.team && isDefined(workspaceMember.team.managerId)) {
        payload.data.managerId = workspaceMember.team.managerId;
      }
    }

    return payload;
  }
}
