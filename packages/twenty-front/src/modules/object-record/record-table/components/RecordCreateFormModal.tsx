import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

import { useOpenRecordInCommandMenu } from '@/command-menu/hooks/useOpenRecordInCommandMenu';
import { formatFieldMetadataItemAsFieldDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsFieldDefinition';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { FormFieldInput } from '@/object-record/record-field/ui/components/FormFieldInput';
import { isFieldRelation } from '@/object-record/record-field/ui/types/guards/isFieldRelation';
import { recordIndexOpenRecordInState } from '@/object-record/record-index/states/recordIndexOpenRecordInState';
import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { useBuildRecordInputFromFilters } from '@/object-record/record-table/hooks/useBuildRecordInputFromFilters';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { canOpenObjectInSidePanel } from '@/object-record/utils/canOpenObjectInSidePanel';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { ViewOpenRecordInType } from '@/views/types/ViewOpenRecordInType';
import styled from '@emotion/styled';
import { AppPath } from 'twenty-shared/types';
import { IconDeviceFloppy, IconX } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { type JsonValue } from 'type-fest';
import { useNavigateApp } from '~/hooks/useNavigateApp';

const StyledModalContent = styled(Modal.Content)`
  max-height: 70vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(6)};
`;

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
`;

type RecordCreateFormModalProps = {
  modalId: string;
  onClose: () => void;
  onRecordCreated?: (record: ObjectRecord) => void;
};

export const RecordCreateFormModal = ({
  modalId,
  onClose,
  onRecordCreated,
}: RecordCreateFormModalProps) => {
  const { objectMetadataItem } = useRecordTableContextOrThrow();
  const [formData, setFormData] = useState<Record<string, JsonValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createOneRecord } = useCreateOneRecord({
    objectNameSingular: objectMetadataItem.nameSingular,
    shouldMatchRootQueryFilter: true,
  });

  const { buildRecordInputFromFilters } = useBuildRecordInputFromFilters({
    objectMetadataItem,
  });

  const recordIndexOpenRecordIn = useRecoilValue(recordIndexOpenRecordInState);
  const { openRecordInCommandMenu } = useOpenRecordInCommandMenu();
  const navigate = useNavigateApp();

  // Get visible fields (excluding relations for now to keep it simple)
  const visibleFields = objectMetadataItem.fields
    .filter((field) => !field.isSystem && !isFieldRelation(field))
    .map((field) =>
      formatFieldMetadataItemAsFieldDefinition({ field, objectMetadataItem }),
    );

  const handleFieldChange = (fieldName: string, value: JsonValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const recordId = v4();
      const recordInputFromFilters = buildRecordInputFromFilters();

      const newRecord = await createOneRecord({
        id: recordId,
        ...recordInputFromFilters,
        ...formData,
      });

      onRecordCreated?.(newRecord);

      // Navigate to the new record based on user preference
      if (
        recordIndexOpenRecordIn === ViewOpenRecordInType.SIDE_PANEL &&
        canOpenObjectInSidePanel(objectMetadataItem.nameSingular)
      ) {
        openRecordInCommandMenu({
          recordId,
          objectNameSingular: objectMetadataItem.nameSingular,
          isNewRecord: true,
        });
      } else {
        navigate(AppPath.RecordShowPage, {
          objectNameSingular: objectMetadataItem.nameSingular,
          objectRecordId: recordId,
        });
      }

      onClose();
    } catch {
      // TODO: Add proper error handling with snackbar notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal modalId={modalId} size="medium">
      <StyledModalContent>
        <StyledTitle>Create {objectMetadataItem.labelSingular}</StyledTitle>

        <StyledFormContainer>
          {visibleFields.map((field) => (
            <FormFieldInput
              key={field.metadata.fieldName}
              field={field}
              defaultValue={formData[field.metadata.fieldName]}
              onChange={(value) =>
                handleFieldChange(field.metadata.fieldName, value)
              }
            />
          ))}
        </StyledFormContainer>

        <StyledButtonContainer>
          <Button
            title="Cancel"
            variant="secondary"
            onClick={handleCancel}
            Icon={IconX}
            disabled={isSubmitting}
          />
          <Button
            title={isSubmitting ? 'Creating...' : 'Create Record'}
            variant="primary"
            onClick={handleSave}
            Icon={IconDeviceFloppy}
            disabled={isSubmitting}
          />
        </StyledButtonContainer>
      </StyledModalContent>
    </Modal>
  );
};
