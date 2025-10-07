import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useIsRecordReadOnly } from '@/object-record/read-only/hooks/useIsRecordReadOnly';
import { isRecordFieldReadOnly } from '@/object-record/read-only/utils/isRecordFieldReadOnly';
import { useFieldListFieldMetadataItems } from '@/object-record/record-field-list/hooks/useFieldListFieldMetadataItems';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { RecordInlineCell } from '@/object-record/record-inline-cell/components/RecordInlineCell';
import { PropertyBox } from '@/object-record/record-inline-cell/property-box/components/PropertyBox';
import { PropertyBoxSkeletonLoader } from '@/object-record/record-inline-cell/property-box/components/PropertyBoxSkeletonLoader';
// import { useRecordInputContainerActions } from '@/object-record/record-input/hooks/useRecordInputContainerActions';
// import { useRecordInputContainerData } from '@/object-record/record-input/hooks/useRecordInputContainerData';
// import { RecordInputFieldListComponentInstanceContext } from '@/object-record/record-input/states/contexts/RecordInputFieldListComponentInstanceContext';
// import { recordInputFieldListHoverPositionComponentState } from '@/object-record/record-input/states/recordInputFieldListHoverPositionComponentState';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { getObjectPermissionsFromMapByObjectMetadataId } from '@/settings/roles/role-permissions/objects-permissions/utils/getObjectPermissionsFromMapByObjectMetadataId';

type RecordInputFieldListProps = {
  instanceId: string;
  objectNameSingular: string;
  objectRecordId?: string;
  objectMetadataItem: ObjectMetadataItem;
  isCreateMode: boolean;
  excludeFieldMetadataIds?: string[];
  excludeCreatedAtAndUpdatedAt?: boolean;
};

export const RecordInputFieldList = ({
  instanceId,
  objectNameSingular,
  objectRecordId,
  objectMetadataItem,
  isCreateMode,
  excludeFieldMetadataIds = [],
  excludeCreatedAtAndUpdatedAt = true,
}: RecordInputFieldListProps) => {
  // Simplified data loading
  const recordLoading = false;
  const isPrefetchLoading = false;

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();

  // Simplified update function
  const useUpdateOneObjectRecordMutation = () => {
    const updateEntity = (params: any) => {
      console.log('Update record:', params);
    };
    return [updateEntity, { loading: false }];
  };

  const isRecordReadOnly = useIsRecordReadOnly({
    recordId: objectRecordId || '',
    objectMetadataId: objectMetadataItem.id,
  });

  const handleMouseEnter = (index: number) => {
    // Simplified hover handling
    console.log('Mouse enter field:', index);
  };

  const {
    inlineFieldMetadataItems,
  } = useFieldListFieldMetadataItems({
    objectNameSingular,
    excludeFieldMetadataIds,
    showRelationSections: false, // Disable relations for input form
    excludeCreatedAtAndUpdatedAt,
  });

  // Filter out read-only fields for create mode
  const editableFieldMetadataItems = isCreateMode 
    ? inlineFieldMetadataItems.filter(field => !field.isUIReadOnly)
    : inlineFieldMetadataItems;

  return (
    <div>
      <PropertyBox>
        {isPrefetchLoading && !isCreateMode ? (
          <PropertyBoxSkeletonLoader />
        ) : (
          <>
            {editableFieldMetadataItems?.map((fieldMetadataItem, index) => (
              <FieldContext.Provider
                key={(objectRecordId || 'new') + fieldMetadataItem.id}
                value={{
                  recordId: objectRecordId || '',
                  maxWidth: 200,
                  isLabelIdentifier: false,
                  fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
                    field: fieldMetadataItem,
                    position: index,
                    objectMetadataItem,
                    showLabel: true,
                    labelWidth: 90,
                  }),
                  // useUpdateRecord: useUpdateOneObjectRecordMutation,
                  isDisplayModeFixHeight: true,
                  isRecordFieldReadOnly: isCreateMode ? false : isRecordFieldReadOnly({
                    isRecordReadOnly,
                    objectPermissions:
                      getObjectPermissionsFromMapByObjectMetadataId({
                        objectPermissionsByObjectMetadataId,
                        objectMetadataId: objectMetadataItem.id,
                      }),
                    fieldMetadataItem: {
                      id: fieldMetadataItem.id,
                      isUIReadOnly: fieldMetadataItem.isUIReadOnly ?? false,
                    },
                  }),
                  onMouseEnter: () => handleMouseEnter(index),
                  anchorId: `${getRecordFieldInputInstanceId({
                    recordId: objectRecordId || 'new',
                    fieldName: fieldMetadataItem.name,
                    prefix: instanceId,
                  })}`,
                }}
              >
                <RecordFieldComponentInstanceContext.Provider
                  value={{
                    instanceId: getRecordFieldInputInstanceId({
                      recordId: objectRecordId || 'new',
                      fieldName: fieldMetadataItem.name,
                      prefix: instanceId,
                    }),
                  }}
                >
                  <RecordInlineCell
                    loading={recordLoading && !isCreateMode}
                    instanceIdPrefix={instanceId}
                  />
                </RecordFieldComponentInstanceContext.Provider>
              </FieldContext.Provider>
            ))}
          </>
        )}
      </PropertyBox>
    </div>
  );
};