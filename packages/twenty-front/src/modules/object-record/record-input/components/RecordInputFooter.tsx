import styled from '@emotion/styled';
import { IconCheck, IconX } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';

const StyledButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
`;

type RecordInputFooterProps = {
  objectNameSingular: string;
  objectRecordId?: string;
  isCreateMode: boolean;
  loading: boolean;
  onCancel: () => void;
  onSave: (recordId: string) => void;
};

export const RecordInputFooter = ({
  objectNameSingular,
  objectRecordId,
  isCreateMode,
  loading,
  onCancel,
  onSave,
}: RecordInputFooterProps) => {
  const handleSave = () => {
    // TODO: Implement actual save logic
    // For now, just call onSave with the recordId or a new ID
    const recordIdToSave = objectRecordId || 'new-record-id';
    onSave(recordIdToSave);
  };

  const saveButtonText = isCreateMode ? 'Add' : 'Save';
  const saveButtonTitle = isCreateMode 
    ? `Add ${objectNameSingular}` 
    : `Save ${objectNameSingular}`;

  return (
    <StyledButtonContainer>
      <Button
        title="Cancel"
        variant="secondary"
        size="small"
        Icon={IconX}
        onClick={onCancel}
        disabled={loading}
      />
      <Button
        title={saveButtonTitle}
        variant="primary"
        size="small"
        Icon={IconCheck}
        onClick={handleSave}
        disabled={loading}
      />
    </StyledButtonContainer>
  );
};