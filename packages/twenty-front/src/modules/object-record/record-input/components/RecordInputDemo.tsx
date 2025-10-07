import { RecordInputModal } from '@/object-record/record-input/components/RecordInputModal';
import { useRecordInput } from '@/object-record/record-input/hooks/useRecordInput';
import styled from '@emotion/styled';
import { IconPlus } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';

const StyledContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

export const RecordInputDemo = () => {
  const { openRecordInput, recordInputModalId } = useRecordInput();
  
  const isRecordInputModalOpen = useRecoilComponentValue(
    isModalOpenedComponentState,
    recordInputModalId,
  );

  const handleCreatePerson = () => {
    openRecordInput({
      objectNameSingular: 'person',
    });
  };

  const handleCreateCompany = () => {
    openRecordInput({
      objectNameSingular: 'company',
    });
  };

  const handleCreateOpportunity = () => {
    openRecordInput({
      objectNameSingular: 'opportunity',
    });
  };



  return (
    <StyledContainer>
      <StyledTitle>Record Input Demo</StyledTitle>
      <StyledDescription>
        This demo shows the new record input feature that allows creating records
        in a modal with the same field layout as the record show page.
      </StyledDescription>
      
      <StyledButtonContainer>
        <Button
          title="Create Person"
          variant="primary"
          size="small"
          Icon={IconPlus}
          onClick={handleCreatePerson}
        />
        
        <Button
          title="Create Company"
          variant="primary"
          size="small"
          Icon={IconPlus}
          onClick={handleCreateCompany}
        />
        
        <Button
          title="Create Opportunity"
          variant="primary"
          size="small"
          Icon={IconPlus}
          onClick={handleCreateOpportunity}
        />
      </StyledButtonContainer>

      {/* The modal will be rendered when opened */}
      {isRecordInputModalOpen && (
        <RecordInputModal
          objectNameSingular="person" // This would be dynamic based on which button was clicked
        />
      )}
    </StyledContainer>
  );
};