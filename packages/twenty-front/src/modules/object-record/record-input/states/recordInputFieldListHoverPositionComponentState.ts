import { RecordInputFieldListComponentInstanceContext } from '@/object-record/record-input/states/contexts/RecordInputFieldListComponentInstanceContext';
import { createComponentState } from '@/ui/utilities/state/component-state/utils/createComponentState';

export const recordInputFieldListHoverPositionComponentState =
  createComponentState<number | null>({
    key: 'recordInputFieldListHoverPositionComponentState',
    defaultValue: null,
    componentInstanceContext: RecordInputFieldListComponentInstanceContext,
  });