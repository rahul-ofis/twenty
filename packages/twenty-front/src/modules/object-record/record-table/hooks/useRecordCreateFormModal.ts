import { useModal } from '@/ui/layout/modal/hooks/useModal';

const RECORD_CREATE_FORM_MODAL_ID = 'record-create-form-modal';

export const useRecordCreateFormModal = () => {
  const { openModal, closeModal } = useModal();

  const openRecordCreateFormModal = () => {
    openModal(RECORD_CREATE_FORM_MODAL_ID);
  };

  const closeRecordCreateFormModal = () => {
    closeModal(RECORD_CREATE_FORM_MODAL_ID);
  };

  return {
    openRecordCreateFormModal,
    closeRecordCreateFormModal,
    recordCreateFormModalId: RECORD_CREATE_FORM_MODAL_ID,
  };
};
