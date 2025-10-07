import { useGetStandardObjectIcon } from '@/object-metadata/hooks/useGetStandardObjectIcon';
import { useLabelIdentifierFieldMetadataItem } from '@/object-metadata/hooks/useLabelIdentifierFieldMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import type { RecordUpdateHook, RecordUpdateHookParams } from '@/object-record/record-field/ui/contexts/FieldContext';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
// import { useRecordInputContainerActions } from '@/object-record/record-input/hooks/useRecordInputContainerActions';
import { useRecordInputContainerData } from '@/object-record/record-input/hooks/useRecordInputContainerData';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { recordStoreIdentifierFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreIdentifierSelector';
import { RecordTitleCell } from '@/object-record/record-title-cell/components/RecordTitleCell';
import { RecordTitleCellContainerType } from '@/object-record/record-title-cell/types/RecordTitleCellContainerType';
import { ShowPageSummaryCard } from '@/ui/layout/show-page/components/ShowPageSummaryCard';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import { FieldMetadataType } from '~/generated-metadata/graphql';

type RecordInputSummaryCardProps = {
  objectNameSingular: string;
  objectRecordId?: string;
  objectMetadataItem: ObjectMetadataItem;
  isInRightDrawer: boolean;
  isCreateMode: boolean;
};

export const RecordInputSummaryCard = ({
  objectNameSingular,
  objectRecordId,
  objectMetadataItem,
  isInRightDrawer,
  isCreateMode,
}: RecordInputSummaryCardProps) => {
  const { recordLoading, isPrefetchLoading } = useRecordInputContainerData({
    objectRecordId,
  });

  const recordCreatedAt = useRecoilValue<string | null>(
    recordStoreFamilySelector({
      recordId: objectRecordId || '',
      fieldName: 'createdAt',
    }),
  );

  // Temporary placeholder functions
  const onUploadPicture = async (file: File) => {
    console.log('Upload picture:', file);
  };
  
  const useUpdateOneObjectRecordMutation: RecordUpdateHook = () => {
    const updateEntity = (params: RecordUpdateHookParams) => {
      console.log('Update record:', params);
    };
    return [updateEntity, { loading: false }];
  };

  const { Icon, IconColor } = useGetStandardObjectIcon(objectNameSingular);
  const isMobile = useIsMobile() || isInRightDrawer;

  const recordIdentifier = useRecoilValue(
    recordStoreIdentifierFamilySelector({
      objectNameSingular,
      recordId: objectRecordId || '',
    }),
  );

  const { labelIdentifierFieldMetadataItem } =
    useLabelIdentifierFieldMetadataItem({
      objectNameSingular,
    });

  const isTitleReadOnly = useIsRecordFieldReadOnly({
    recordId: objectRecordId || '',
    fieldMetadataId: labelIdentifierFieldMetadataItem?.id ?? '',
    objectMetadataId: objectMetadataItem.id,
  });

  const displayTitle = isCreateMode ? `New ${objectMetadataItem.labelSingular}` : recordIdentifier?.name;
  const displayDate = isCreateMode ? new Date().toISOString() : recordCreatedAt;

  return (
    <ShowPageSummaryCard
      isMobile={isMobile}
      id={objectRecordId || 'new-record'}
      logoOrAvatar={recordIdentifier?.avatarUrl ?? ''}
      icon={Icon}
      iconColor={IconColor}
      avatarPlaceholder={displayTitle ?? ''}
      date={displayDate ?? ''}
      loading={
        !isCreateMode && (isPrefetchLoading || recordLoading || !isDefined(recordCreatedAt))
      }
      title={
        isCreateMode ? (
          <span>{displayTitle}</span>
        ) : (
          <FieldContext.Provider
            value={{
              recordId: objectRecordId || '',
              isLabelIdentifier: false,
              fieldDefinition: {
                type:
                  labelIdentifierFieldMetadataItem?.type ||
                  FieldMetadataType.TEXT,
                iconName: '',
                fieldMetadataId: labelIdentifierFieldMetadataItem?.id ?? '',
                label: labelIdentifierFieldMetadataItem?.label || '',
                metadata: {
                  fieldName: labelIdentifierFieldMetadataItem?.name || '',
                  objectMetadataNameSingular: objectNameSingular,
                },
                defaultValue: labelIdentifierFieldMetadataItem?.defaultValue,
              },
              useUpdateRecord: useUpdateOneObjectRecordMutation,
              isCentered: !isMobile,
              isDisplayModeFixHeight: true,
              isRecordFieldReadOnly: isTitleReadOnly,
            }}
          >
            <RecordTitleCell
              sizeVariant="md"
              containerType={RecordTitleCellContainerType.ShowPage}
            />
          </FieldContext.Provider>
        )
      }
      avatarType={recordIdentifier?.avatarType ?? 'rounded'}
      onUploadPicture={
        objectNameSingular === CoreObjectNameSingular.Person
          ? onUploadPicture
          : undefined
      }
    />
  );
};