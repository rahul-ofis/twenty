import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { useSetRecoilComponentState } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentState';
import { useEffect } from 'react';

type RecordInputContainerContextStoreTargetedRecordsEffectProps = {
  recordId: string;
};

export const RecordInputContainerContextStoreTargetedRecordsEffect = ({
  recordId,
}: RecordInputContainerContextStoreTargetedRecordsEffectProps) => {
  const setContextStoreTargetedRecordsRule = useSetRecoilComponentState(
    contextStoreTargetedRecordsRuleComponentState,
  );

  useEffect(() => {
    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [recordId],
    });
  }, [recordId, setContextStoreTargetedRecordsRule]);

  return null;
};