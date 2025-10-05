import { Module } from '@nestjs/common';

import { NewLeadCreateManyPreQueryHook } from 'src/modules/new-lead/query-hooks/new-lead-create-many.pre-query-hook';
import { NewLeadCreateOnePreQueryHook } from 'src/modules/new-lead/query-hooks/new-lead-create-one.pre-query-hook';
import { NewLeadUpdateManyPreQueryHook } from 'src/modules/new-lead/query-hooks/new-lead-update-many.pre-query-hook';
import { NewLeadUpdateOnePreQueryHook } from 'src/modules/new-lead/query-hooks/new-lead-update-one.pre-query-hook';

@Module({
  providers: [
    NewLeadCreateOnePreQueryHook,
    NewLeadCreateManyPreQueryHook,
    NewLeadUpdateOnePreQueryHook,
    NewLeadUpdateManyPreQueryHook,
  ],
})
export class NewLeadQueryHookModule {}
