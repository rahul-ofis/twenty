# Record Input Feature

The Record Input feature provides a modal-based interface for creating and editing records with the same field layout and UI patterns as the record show page. It's designed to be a reusable component that can be integrated throughout the application.

## Features

- **Modal-based interface**: Clean, focused UI for record creation/editing
- **Consistent field layout**: Uses the same field rendering as record show pages
- **Create and Edit modes**: Supports both creating new records and editing existing ones
- **Field validation**: Integrates with existing field validation systems
- **Responsive design**: Works on both desktop and mobile devices
- **Extensible**: Easy to customize and extend for specific use cases

## Architecture

The record input feature follows the same architectural patterns as the record-show module:

```
record-input/
├── components/           # UI components
│   ├── RecordInputContainer.tsx          # Main container component
│   ├── RecordInputSubContainer.tsx       # Layout and content container
│   ├── RecordInputSummaryCard.tsx        # Header with record title/icon
│   ├── RecordInputFieldsCard.tsx         # Fields container
│   ├── RecordInputFieldList.tsx          # Field list renderer
│   ├── RecordInputFooter.tsx             # Cancel/Save buttons
│   ├── RecordInputModal.tsx              # Modal wrapper
│   └── RecordInputDemo.tsx               # Demo component
├── hooks/                # Custom hooks
│   ├── useRecordInput.ts                 # Main hook for opening/closing
│   ├── useRecordInputContainerData.ts    # Data fetching hook
│   └── useRecordInputContainerActions.ts # Actions hook
├── contexts/             # React contexts
│   └── RecordInputContext.ts             # Context for sharing state
└── states/               # Recoil state management
    ├── contexts/
    │   └── RecordInputFieldListComponentInstanceContext.ts
    └── recordInputFieldListHoverPositionComponentState.ts
```

## Usage

### Basic Usage

```tsx
import { useRecordInput } from '@/object-record/record-input';

const MyComponent = () => {
  const { openRecordInput } = useRecordInput();

  const handleCreateRecord = () => {
    openRecordInput({
      objectNameSingular: 'person', // The object type to create
    });
  };

  const handleEditRecord = () => {
    openRecordInput({
      objectNameSingular: 'person',
      recordId: 'existing-record-id', // For edit mode
    });
  };

  return (
    <div>
      <Button onClick={handleCreateRecord}>Create Person</Button>
      <Button onClick={handleEditRecord}>Edit Person</Button>
    </div>
  );
};
```

### Integration with Existing Add Record Buttons

The feature has been integrated with the existing `RecordIndexAddRecordButton`:

```tsx
// Before
const { openRecordCreateFormModal } = useRecordCreateFormModal();

// After  
const { openRecordInput } = useRecordInput();

const handleAddRecordClick = () => {
  openRecordInput({
    objectNameSingular: objectMetadataItem.nameSingular,
  });
};
```

### Custom Modal Integration

```tsx
import { RecordInputModal } from '@/object-record/record-input';

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Create Record
      </Button>
      
      {isModalOpen && (
        <RecordInputModal
          objectNameSingular="company"
          onCancel={() => setIsModalOpen(false)}
          onSave={(recordId) => {
            console.log('Record saved:', recordId);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};
```

## Components

### RecordInputContainer

The main container component that orchestrates the entire record input experience.

**Props:**
- `objectNameSingular: string` - The object type (e.g., 'person', 'company')
- `recordId?: string` - Optional record ID for edit mode
- `isInRightDrawer?: boolean` - Whether displayed in a right drawer (default: false)
- `onCancel: () => void` - Callback when user cancels
- `onSave: (recordId: string) => void` - Callback when user saves

### RecordInputModal

A modal wrapper around RecordInputContainer for easy integration.

**Props:**
- `objectNameSingular: string` - The object type
- `recordId?: string` - Optional record ID for edit mode

### RecordInputDemo

A demo component showing various usage examples.

## Hooks

### useRecordInput

Main hook for opening and closing the record input modal.

```tsx
const {
  openRecordInput,     // Function to open the modal
  closeRecordInput,    // Function to close the modal
  recordInputModalId   // Modal ID for checking state
} = useRecordInput();
```

### useRecordInputContainerData

Hook for fetching record data (used internally).

### useRecordInputContainerActions

Hook for record actions like save/update (used internally).

## State Management

The feature uses Recoil for state management, following the same patterns as other Twenty modules:

- **RecordInputContext**: Provides object metadata and record ID to child components
- **Component instance contexts**: For managing field-level state
- **Hover state**: For field interaction feedback

## Field Rendering

The record input uses the same field rendering system as the record show page:

- **RecordInputFieldList**: Renders all editable fields for the object
- **Field filtering**: Automatically excludes read-only fields in create mode
- **Field validation**: Integrates with existing field validation
- **Field types**: Supports all existing field types (text, email, phone, etc.)

## Styling

The components use the same styling system as other Twenty components:

- **Emotion/styled**: For component styling
- **Theme integration**: Uses the Twenty theme system
- **Responsive design**: Adapts to different screen sizes
- **Consistent spacing**: Follows Twenty spacing guidelines

## Future Enhancements

Potential areas for future development:

1. **Form validation**: Enhanced client-side validation
2. **Field dependencies**: Support for conditional field visibility
3. **Bulk operations**: Support for creating multiple records
4. **Templates**: Pre-filled record templates
5. **Workflow integration**: Integration with workflow triggers
6. **Custom layouts**: Support for custom field layouts per object type

## Testing

The feature includes:

- **Component tests**: Unit tests for individual components
- **Integration tests**: Tests for the complete record input flow
- **E2E tests**: End-to-end tests for user workflows

## Performance

The feature is optimized for performance:

- **Lazy loading**: Components are loaded only when needed
- **Memoization**: Expensive computations are memoized
- **Efficient re-renders**: Minimal re-renders through proper state management
- **Code splitting**: Modal components can be code-split for better loading

## Accessibility

The feature follows accessibility best practices:

- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Proper ARIA labels and descriptions
- **Focus management**: Proper focus handling in modal
- **Color contrast**: Meets WCAG guidelines