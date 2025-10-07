import { type ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { RecordInputFieldList } from '@/object-record/record-input/components/RecordInputFieldList';

type RecordInputFieldsCardProps = {
  objectNameSingular: string;
  objectRecordId?: string;
  objectMetadataItem: ObjectMetadataItem;
  isCreateMode: boolean;
};

export const RecordInputFieldsCard = ({
  objectNameSingular,
  objectRecordId,
  objectMetadataItem,
  isCreateMode,
}: RecordInputFieldsCardProps) => {
  return (
    <RecordInputFieldList
      instanceId={`record-input-fields-card-${objectRecordId || 'new'}`}
      objectNameSingular={objectNameSingular}
      objectRecordId={objectRecordId}
      objectMetadataItem={objectMetadataItem}
      isCreateMode={isCreateMode}
    />
  );
};