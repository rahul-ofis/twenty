import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { RecordInputContainerContextStoreTargetedRecordsEffect } from '@/object-record/record-input/components/RecordInputContainerContextStoreTargetedRecordsEffect';
import { RecordInputSubContainer } from '@/object-record/record-input/components/RecordInputSubContainer';
import { useRecordInputContainerData } from '@/object-record/record-input/hooks/useRecordInputContainerData';
import styled from '@emotion/styled';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 500px;
`;

type RecordInputContainerProps = {
  objectNameSingular: string;
  recordId?: string; // Optional for create mode
  isInRightDrawer?: boolean;
  onCancel: () => void;
  onSave: (recordId: string) => void;
};

export const RecordInputContainer = ({
  objectNameSingular,
  recordId,
  isInRightDrawer = false,
  onCancel,
  onSave,
}: RecordInputContainerProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { loading } = useRecordInputContainerData({
    objectRecordId: recordId,
  });

  return (
    <>
      {recordId && (
        <RecordInputContainerContextStoreTargetedRecordsEffect
          recordId={recordId}
        />
      )}
      <StyledContainer>
        <RecordInputSubContainer
          objectNameSingular={objectNameSingular}
          objectRecordId={recordId}
          objectMetadataItem={objectMetadataItem}
          isInRightDrawer={isInRightDrawer}
          loading={loading}
          onCancel={onCancel}
          onSave={onSave}
        />
      </StyledContainer>
    </>
  );
};