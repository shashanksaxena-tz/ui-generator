# Chakra UI Component Catalog

Source: https://chakra-ui.com/

This catalog focuses on Chakra UI components that are NOT already available in shadcn/ui, providing complementary functionality to our existing component library.

## Statistics & Data Display (8 components)

### High Priority
- **Stat** - Statistics display component with label, number, and help text
- **StatLabel** - Label for stat component
- **StatNumber** - Main number display for stat
- **StatHelpText** - Helper text for stat
- **StatArrow** - Arrow indicator for stat trends
- **StatGroup** - Group multiple stats together
- **CircularProgress** - Circular progress indicator with customizable size and color
- **CircularProgressLabel** - Label for circular progress

## Layout Components (6 components)

### High Priority
- **SimpleGrid** - Responsive grid with automatic column sizing
- **Wrap** - Flex container that wraps children automatically
- **WrapItem** - Individual item in Wrap container
- **Divider** - Visual divider line (horizontal/vertical)
- **Stack** - Stack children with consistent spacing (vertical/horizontal)
- **StackDivider** - Divider between stack items

## Form Components (4 components)

### High Priority
- **NumberInput** - Number input with increment/decrement steppers
- **NumberInputField** - Input field for number input
- **NumberInputStepper** - Stepper controls container
- **NumberIncrementStepper** - Increment button for number input
- **NumberDecrementStepper** - Decrement button for number input

### Medium Priority
- **PinInput** - PIN/OTP input component
- **PinInputField** - Individual field in PIN input
- **Editable** - Inline editable text component
- **EditableInput** - Input for editable component
- **EditablePreview** - Preview for editable component

## Feedback Components (6 components)

### High Priority
- **Tag** - Tag/label component for categorization
- **TagLabel** - Label text for tag
- **TagCloseButton** - Close button for tag
- **TagLeftIcon** - Left icon for tag
- **TagRightIcon** - Right icon for tag

### Medium Priority
- **Skeleton** - Loading skeleton placeholder
- **SkeletonCircle** - Circular skeleton loader
- **SkeletonText** - Text skeleton loader

## Typography & Display (5 components)

### High Priority
- **Kbd** - Keyboard key display component
- **Code** - Inline code display
- **List** - Ordered/unordered list component
- **ListItem** - Individual list item
- **ListIcon** - Icon for list items

## Utility Components (8 components)

### High Priority
- **Portal** - Render component in a different part of DOM tree
- **CloseButton** - Reusable close button component
- **IconButton** - Button with only an icon (Chakra variant)
- **VisuallyHidden** - Hide content visually but keep for screen readers

### Medium Priority
- **Show** - Conditionally show content based on breakpoints
- **Hide** - Conditionally hide content based on breakpoints
- **Center** - Center children horizontally and vertically
- **Square** - Square container with equal width/height
- **Circle** - Circular container
- **Container** - Responsive container with max-width

## Overlay Components (4 components)

### Medium Priority
- **Popover** - Popover overlay component
- **PopoverTrigger** - Trigger for popover
- **PopoverContent** - Content container for popover
- **PopoverHeader** - Header for popover
- **PopoverBody** - Body for popover
- **PopoverFooter** - Footer for popover
- **PopoverArrow** - Arrow for popover
- **PopoverCloseButton** - Close button for popover

## Navigation Enhancements (3 components)

### Medium Priority
- **Breadcrumb** - Breadcrumb navigation (different from Material UI)
- **BreadcrumbItem** - Individual breadcrumb item
- **BreadcrumbLink** - Link in breadcrumb
- **BreadcrumbSeparator** - Separator between breadcrumbs

## Media Components (3 components)

### Medium Priority
- **AspectRatio** - Maintain aspect ratio container
- **Image** - Enhanced image component with fallback
- **Avatar** - Avatar component with fallback and badge
- **AvatarBadge** - Badge for avatar
- **AvatarGroup** - Group of overlapping avatars

---

## Summary

**Total Components: ~47 (component + sub-components)**
**Unique Top-Level Components: 25**

**By Priority:**
- High Priority: 15 top-level components
- Medium Priority: 10 top-level components

**By Category:**
- Statistics & Data Display: 8 (including sub-components)
- Layout Components: 6
- Utility Components: 8
- Form Components: 9 (including sub-components)
- Feedback Components: 6
- Typography & Display: 5
- Overlay Components: 4
- Navigation Enhancements: 3
- Media Components: 3

**Key Differentiators from shadcn/ui:**
- **Stat components** - Comprehensive statistics display system
- **CircularProgress** - Circular progress indicators
- **SimpleGrid** - Auto-responsive grid system
- **Wrap** - Automatic wrapping flex container
- **NumberInput** - Stepper-based number input
- **Tag** - Complete tag/chip system
- **Kbd** - Keyboard key display
- **Portal** - DOM portal rendering
- **PinInput** - OTP/PIN input system
- **Editable** - Inline editing component

**Recommended Initial Implementation: Top 15 High Priority Components**
1. Stat (with sub-components)
2. CircularProgress
3. SimpleGrid
4. Wrap
5. Tag (with sub-components)
6. Divider
7. Kbd
8. NumberInput (with steppers)
9. Portal
10. CloseButton
11. IconButton
12. VisuallyHidden
13. Stack (if not in shadcn)
14. Code
15. List

**Integration Strategy:**
- Import directly from `@chakra-ui/react`
- Wrap in our component schema system
- Maintain Chakra's theming capabilities
- Ensure compatibility with existing Tailwind styling

**Dependencies Required:**
```json
{
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0"
}
```

**Note:** Chakra UI uses Emotion for styling, which works alongside Tailwind CSS without conflicts. Components can be themed using Chakra's theme system.
