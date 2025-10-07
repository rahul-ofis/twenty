import { useOpenRecordInCommandMenu } from '@/command-menu/hooks/useOpenRecordInCommandMenu';
import { useCallback } from 'react';

export const useRecordInput = () => {
  const { openRecordInCommandMenu } = useOpenRecordInCommandMenu();

  const openRecordInput = useCallback(
    ({
      objectNameSingular,
      recordId,
    }: {
      objectNameSingular: string;
      recordId?: string;
    }) => {
      console.log('Opening record input for:', objectNameSingular, recordId);
      
      if (recordId) {
        // Edit existing record
        openRecordInCommandMenu({
          recordId,
          objectNameSingular,
          isNewRecord: false,
        });
      } else {
        // Create new record - open record show in create mode
        openRecordInCommandMenu({
          recordId: 'create-new', // Special ID to indicate creation mode
          objectNameSingular,
          isNewRecord: true,
        });
      }
    },
    [openRecordInCommandMenu],
  );

  const closeRecordInput = useCallback(() => {
    // The command menu handles closing automatically
    console.log('Record input closed');
  }, []);

  return {
    openRecordInput,
    closeRecordInput,
  };
};