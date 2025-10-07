import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { RecordInputFieldsCard } from '@/object-record/record-input/components/RecordInputFieldsCard';
import { RecordInputFooter } from '@/object-record/record-input/components/RecordInputFooter';
import { RecordInputSummaryCard } from '@/object-record/record-input/components/RecordInputSummaryCard';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import styled from '@emotion/styled';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledContentContainer = styled.div<{ isInRightDrawer: boolean }>`
  flex: 1;
  overflow-y: auto;
  background: ${({ theme }) => theme.background.primary};
  padding: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme, isInRightDrawer }) =>
    isInRightDrawer ? theme.spacing(16) : theme.spacing(3)};
`;

const StyledCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

type RecordInputSubContainerProps = {
  objectNameSingular: string;
  objectRecordId?: string;
  objectMetadataItem: ObjectMetadataItem;
  isInRightDrawer?: boolean;
  loading: boolean;
  onCancel: () => void;
  onSave: (recordId: string) => void;
};

export const RecordInputSubContainer = ({
  objectNameSingular,
  objectRecordId,
  objectMetadataItem,
  isInRightDrawer = false,
  loading,
  onCancel,
  onSave,
}: RecordInputSubContainerProps) => {
  const isMobile = useIsMobile();

  const isCreateMode = !objectRecordId;

  return (
    <StyledContainer>
      <StyledContentContainer isInRightDrawer={isInRightDrawer}>
        <StyledCardsContainer>
          <RecordInputSummaryCard
            objectNameSingular={objectNameSingular}
            objectRecordId={objectRecordId}
            objectMetadataItem={objectMetadataItem}
            isInRightDrawer={isInRightDrawer}
            isCreateMode={isCreateMode}
          />
          <RecordInputFieldsCard
            objectNameSingular={objectNameSingular}
            objectRecordId={objectRecordId}
            objectMetadataItem={objectMetadataItem}
            isCreateMode={isCreateMode}
          />
        </StyledCardsContainer>
      </StyledContentContainer>
      <RecordInputFooter
        objectNameSingular={objectNameSingular}
        objectRecordId={objectRecordId}
        isCreateMode={isCreateMode}
        loading={loading}
        onCancel={onCancel}
        onSave={onSave}
      />
    </StyledContainer>
  );
};