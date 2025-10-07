import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { isObjectMetadataReadOnly } from '@/object-record/read-only/utils/isObjectMetadataReadOnly';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useRecordInput } from '@/object-record/record-input/hooks/useRecordInput';
import styled from '@emotion/styled';
import { IconPlus } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { useIsMobile } from 'twenty-ui/utilities';

const StyledButtonContainer = styled.div`
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

export const RecordIndexAddRecordButton = () => {
  const { objectMetadataItem } = useRecordIndexContextOrThrow();
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();

  const isMobile = useIsMobile();
  const { openRecordInput } = useRecordInput();

  const objectPermissions =
    objectPermissionsByObjectMetadataId[objectMetadataItem.id];

  const handleAddRecordClick = () => {
    openRecordInput({
      objectNameSingular: objectMetadataItem.nameSingular,
    });
  };

  const isReadOnly = isObjectMetadataReadOnly({
    objectPermissions,
    objectMetadataItem,
  });

  const hasObjectUpdatePermissions = objectPermissions?.canUpdateObjectRecords;

  if (isMobile || isReadOnly || !hasObjectUpdatePermissions) {
    return null;
  }

  return (
    <StyledButtonContainer>
      <Button
        title={`Add ${objectMetadataItem.labelSingular}`}
        variant="primary"
        size="small"
        Icon={IconPlus}
        onClick={handleAddRecordClick}
      />
    </StyledButtonContainer>
  );
};
