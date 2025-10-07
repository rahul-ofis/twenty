import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

import { useOpenRecordInCommandMenu } from '@/command-menu/hooks/useOpenRecordInCommandMenu';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { FormFieldInput } from '@/object-record/record-field/ui/components/FormFieldInput';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { isFieldRelation } from '@/object-record/record-field/ui/types/guards/isFieldRelation';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { recordIndexOpenRecordInState } from '@/object-record/record-index/states/recordIndexOpenRecordInState';
import { PropertyBox } from '@/object-record/record-inline-cell/property-box/components/PropertyBox';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { canOpenObjectInSidePanel } from '@/object-record/utils/canOpenObjectInSidePanel';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { ViewOpenRecordInType } from '@/views/types/ViewOpenRecordInType';
import styled from '@emotion/styled';
import { AppPath } from 'twenty-shared/types';
import { IconDeviceFloppy, IconX } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { type JsonValue } from 'type-fest';
import { useNavigateApp } from '~/hooks/useNavigateApp';

const StyledModalContent = styled(Modal.Content)`
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledModalHeader = styled(Modal.Header)`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin: 0;
`;

const StyledHeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledFormContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${({ theme }) => theme.background.primary};
  max-width: 400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)};
`;

type RecordIndexCreateFormModalProps = {
  modalId: string;
  onClose: () => void;
  onRecordCreated?: (record: ObjectRecord) => void;
};

export const RecordIndexCreateFormModal = ({
  modalId,
  onClose,
  onRecordCreated,
}: RecordIndexCreateFormModalProps) => {
  const { objectMetadataItem } = useRecordIndexContextOrThrow();
  const [formData, setFormData] = useState<Record<string, JsonValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createOneRecord } = useCreateOneRecord({
    objectNameSingular: objectMetadataItem.nameSingular,
    shouldMatchRootQueryFilter: true,
  });

  const recordIndexOpenRecordIn = useRecoilValue(recordIndexOpenRecordInState);
  const { openRecordInCommandMenu } = useOpenRecordInCommandMenu();
  const navigate = useNavigateApp();

  // Get visible fields (excluding relations and system fields)
  const visibleFields = objectMetadataItem.fields
    .filter((field) => !field.isSystem && !isFieldRelation(field))
    .map((field, index) =>
      formatFieldMetadataItemAsColumnDefinition({
        field,
        position: index,
        objectMetadataItem,
        showLabel: true,
        labelWidth: 90,
      }),
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

      const newRecord = await createOneRecord({
        id: recordId,
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

  const instanceId = `create-form-${modalId}`;

  return (
    <Modal modalId={modalId} size="medium" padding="none">
      <StyledModalContent>
        <StyledModalHeader>
          <StyledTitle>New {objectMetadataItem.labelSingular}</StyledTitle>
          <StyledHeaderActions>
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
          </StyledHeaderActions>
        </StyledModalHeader>

        <StyledFormContainer>
          <PropertyBox>
            {visibleFields.map((fieldDefinition) => (
              <FieldContext.Provider
                key={fieldDefinition.metadata.fieldName}
                value={{
                  recordId: 'new-record',
                  maxWidth: 200,
                  isLabelIdentifier: false,
                  fieldDefinition,
                  useUpdateRecord: () => [
                    () => {},
                    { loading: false },
                  ],
                  isDisplayModeFixHeight: true,
                  isRecordFieldReadOnly: false,
                  anchorId: `${getRecordFieldInputInstanceId({
                    recordId: 'new-record',
                    fieldName: fieldDefinition.metadata.fieldName,
                    prefix: instanceId,
                  })}`,
                }}
              >
                <RecordFieldComponentInstanceContext.Provider
                  value={{
                    instanceId: getRecordFieldInputInstanceId({
                      recordId: 'new-record',
                      fieldName: fieldDefinition.metadata.fieldName,
                      prefix: instanceId,
                    }),
                  }}
                >
                  <FormFieldInput
                    field={fieldDefinition}
                    defaultValue={formData[fieldDefinition.metadata.fieldName]}
                    onChange={(value) =>
                      handleFieldChange(fieldDefinition.metadata.fieldName, value)
                    }
                  />
                </RecordFieldComponentInstanceContext.Provider>
              </FieldContext.Provider>
            ))}
          </PropertyBox>
        </StyledFormContainer>
      </StyledModalContent>
    </Modal>
  );
};
