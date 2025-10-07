import { RecordInputContainer } from '@/object-record/record-input/components/RecordInputContainer';
import { RecordInputContext } from '@/object-record/record-input/contexts/RecordInputContext';
import { useRecordInput } from '@/object-record/record-input/hooks/useRecordInput';
import { Modal } from '@/ui/layout/modal/components/Modal';

type RecordInputModalProps = {
  objectNameSingular: string;
  recordId?: string;
};

export const RecordInputModal = ({
  objectNameSingular,
  recordId,
}: RecordInputModalProps) => {
  const { closeRecordInput, recordInputModalId } = useRecordInput();
  
  console.log('RecordInputModal rendering with:', { objectNameSingular, recordId, recordInputModalId });
  
  // objectNameSingular should be provided as prop
  if (!objectNameSingular) {
    console.warn('RecordInputModal: objectNameSingular is required');
    return null;
  }

  const handleCancel = () => {
    closeRecordInput();
  };

  const handleSave = (savedRecordId: string) => {
    // TODO: Add success notification
    console.log('Record saved:', savedRecordId);
    closeRecordInput();
  };

  return (
    <Modal
      modalId={recordInputModalId}
      size="medium"
      padding="medium"
    >
      <div style={{ padding: '20px', minHeight: '200px' }}>
        <h2>Record Input Modal</h2>
        <p>Object: {objectNameSingular}</p>
        <p>Record ID: {recordId || 'New Record'}</p>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={() => handleSave('test-id')}>Save</button>
        
        <RecordInputContext.Provider
          value={{
            objectNameSingular,
            objectRecordId: recordId,
          }}
        >
          <RecordInputContainer
            objectNameSingular={objectNameSingular}
            recordId={recordId}
            isInRightDrawer={false}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </RecordInputContext.Provider>
      </div>
    </Modal>
  );
};