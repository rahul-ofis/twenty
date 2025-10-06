import { isObjectMetadataReadOnly } from '@/object-record/read-only/utils/isObjectMetadataReadOnly';
import { hasAnySoftDeleteFilterOnViewComponentSelector } from '@/object-record/record-filter/states/hasAnySoftDeleteFilterOnView';
import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { useRecordCreateFormModal } from '@/object-record/record-table/hooks/useRecordCreateFormModal';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import styled from '@emotion/styled';
import { IconPlus } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { useIsMobile } from 'twenty-ui/utilities';

const StyledButtonContainer = styled.div`
  margin: ${({ theme }) => theme.spacing(1)};
`;

export const RecordTableHeaderAddRecordButton = () => {
  const { objectMetadataItem, objectPermissions } =
    useRecordTableContextOrThrow();

  const isMobile = useIsMobile();

  const { openRecordCreateFormModal } = useRecordCreateFormModal();

  const handleAddRecordClick = () => {
    openRecordCreateFormModal();
  };

  const isReadOnly = isObjectMetadataReadOnly({
    objectPermissions,
    objectMetadataItem,
  });

  const hasAnySoftDeleteFilterOnView = useRecoilComponentValue(
    hasAnySoftDeleteFilterOnViewComponentSelector,
  );

  const hasObjectUpdatePermissions = objectPermissions.canUpdateObjectRecords;

  return (
    !isMobile &&
    !isReadOnly &&
    hasObjectUpdatePermissions &&
    !hasAnySoftDeleteFilterOnView && (
      <StyledButtonContainer>
        <Button
          title={`Add ${objectMetadataItem.labelSingular}`}
          variant="secondary"
          size="small"
          Icon={IconPlus}
          onClick={handleAddRecordClick}
        />
      </StyledButtonContainer>
    )
  );
};
