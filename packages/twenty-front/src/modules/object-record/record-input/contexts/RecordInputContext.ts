import { createContext, useContext } from 'react';

export type RecordInputContextValue = {
  objectNameSingular: string;
  objectRecordId?: string;
};

export const RecordInputContext = createContext<RecordInputContextValue | null>(
  null,
);

export const useRecordInputContext = () => {
  const context = useContext(RecordInputContext);

  if (!context) {
    throw new Error(
      'useRecordInputContext must be used within a RecordInputContext provider',
    );
  }

  return context;
};