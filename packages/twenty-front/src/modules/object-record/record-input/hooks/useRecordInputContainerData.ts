import { recordLoadingFamilyState } from '@/object-record/record-store/states/recordLoadingFamilyState';
import { useIsPrefetchLoading } from '@/prefetch/hooks/useIsPrefetchLoading';
import { useRecoilState } from 'recoil';

type UseRecordInputContainerDataProps = {
  objectRecordId?: string;
};

export const useRecordInputContainerData = ({
  objectRecordId,
}: UseRecordInputContainerDataProps) => {
  const [recordLoading] = useRecoilState(
    recordLoadingFamilyState(objectRecordId || ''),
  );

  const isPrefetchLoading = useIsPrefetchLoading();

  return {
    recordLoading,
    isPrefetchLoading,
    loading: recordLoading,
  };
};