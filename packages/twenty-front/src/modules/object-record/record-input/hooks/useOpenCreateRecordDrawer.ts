import { useOpenRecordInCommandMenu } from '@/command-menu/hooks/useOpenRecordInCommandMenu';
import { useCallback } from 'react';

export const useOpenCreateRecordDrawer = ({
  objectNameSingular,
}: {
  objectNameSingular: string;
}) => {
  const { openRecordInCommandMenu } = useOpenRecordInCommandMenu();

  const openCreateRecordDrawer = useCallback(
    async ({
      initialData = {},
    }: {
      initialData?: Record<string, any>;
    } = {}) => {
      console.log('Creating new record for:', objectNameSingular, initialData);
      
      // For now, let's use a simpler approach and just open the record show
      // with a special flag to indicate it's for creation
      openRecordInCommandMenu({
        recordId: 'create-new', // Special ID to indicate creation mode
        objectNameSingular,
        isNewRecord: true,
      });
    },
    [openRecordInCommandMenu, objectNameSingular],
  );

  return openCreateRecordDrawer;
};