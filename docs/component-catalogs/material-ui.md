# Material UI Component Catalog

Source: https://mui.com/

This catalog focuses on Material UI components that are NOT already available in shadcn/ui, with emphasis on advanced data display components and unique Material Design elements.

## Advanced Data Components (12 components)

### High Priority
- **DataGrid** - Advanced data grid with sorting, filtering, pagination, and virtualization
- **DataGridPro** - Professional data grid with row grouping and tree data
- **TreeView** - Hierarchical tree view component
- **TreeItem** - Individual item in tree view
- **Timeline** - Material Design timeline component
- **TimelineItem** - Individual timeline item
- **TimelineSeparator** - Separator in timeline
- **TimelineDot** - Dot indicator in timeline
- **TimelineConnector** - Connector line in timeline
- **TimelineContent** - Content area in timeline
- **TimelineOppositeContent** - Content on opposite side of timeline

### Medium Priority
- **Autocomplete** - Autocomplete/typeahead input component with advanced features
- **Pagination** - Advanced pagination controls with various styles

## Stepper & Progress (8 components)

### High Priority
- **Stepper** - Step-by-step progress indicator
- **Step** - Individual step in stepper
- **StepLabel** - Label for step
- **StepContent** - Collapsible content for step
- **StepButton** - Clickable step button
- **StepIcon** - Icon for step
- **MobileStepper** - Mobile-optimized stepper
- **StepConnector** - Connector between steps

## Advanced Inputs (8 components)

### High Priority
- **Rating** - Star rating component with half-star support
- **Slider** - Advanced slider with marks and value labels
- **ToggleButton** - Toggle button component
- **ToggleButtonGroup** - Group of toggle buttons

### Medium Priority
- **TransferList** - Dual-list selector component
- **MaskedInput** - Input with mask support
- **SpeedDial** - Floating action button with menu
- **SpeedDialAction** - Action in speed dial
- **SpeedDialIcon** - Icon for speed dial

## Navigation Components (6 components)

### High Priority
- **Breadcrumbs** - Material Design breadcrumb navigation
- **BottomNavigation** - Mobile bottom navigation bar
- **BottomNavigationAction** - Action in bottom navigation
- **Drawer** - Slide-out drawer navigation (different from shadcn)

### Medium Priority
- **SwipeableDrawer** - Touch-swipeable drawer
- **AppBar** - Material Design app bar

## Data Display (10 components)

### High Priority
- **ImageList** - Masonry/grid image list
- **ImageListItem** - Item in image list
- **ImageListItemBar** - Info bar for image list item
- **Chip** - Material Design chip/tag component
- **Avatar** - Material Design avatar with badge support
- **AvatarGroup** - Stack of avatars
- **Badge** - Notification badge component

### Medium Priority
- **List** - Material Design list (more features than HTML list)
- **ListItem** - List item with Material Design styles
- **ListItemButton** - Clickable list item
- **ListItemIcon** - Icon for list item
- **ListItemText** - Text content for list item
- **ListItemAvatar** - Avatar in list item
- **ListSubheader** - Subheader for list sections

## Feedback Components (8 components)

### High Priority
- **Skeleton** - Loading skeleton with wave animation
- **Backdrop** - Backdrop overlay component
- **Snackbar** - Toast notification (Material Design style)
- **Alert** - Alert message component with severity levels

### Medium Priority
- **LinearProgress** - Linear progress bar
- **CircularProgress** - Circular loading spinner
- **Dialog** - Material Design modal dialog
- **DialogTitle** - Title for dialog
- **DialogContent** - Content for dialog
- **DialogActions** - Actions for dialog

## Layout Components (6 components)

### High Priority
- **Grid** - Material Design grid system (12-column)
- **Stack** - Layout component for vertical/horizontal stacks
- **Box** - Low-level layout component with sx prop

### Medium Priority
- **Paper** - Material Design elevated surface
- **Card** - Material Design card (different from shadcn)
- **CardHeader** - Header for Material card
- **CardMedia** - Media container for card
- **CardContent** - Content area for card
- **CardActions** - Actions area for card
- **Divider** - Material Design divider

## Surface Components (5 components)

### Medium Priority
- **Accordion** - Material Design accordion/expansion panel
- **AccordionSummary** - Summary/header for accordion
- **AccordionDetails** - Details content for accordion
- **AccordionActions** - Actions for accordion
- **ExpansionPanel** - Legacy name for accordion

## Utility Components (6 components)

### High Priority
- **Tooltip** - Material Design tooltip with rich positioning
- **Popper** - Low-level positioning utility
- **Portal** - DOM portal component
- **ClickAwayListener** - Detect clicks outside element
- **NoSsr** - Disable server-side rendering
- **Fade** - Fade transition component

---

## Summary

**Total Components: ~69 (component + sub-components)**
**Unique Top-Level Components: 32**

**By Priority:**
- High Priority: 18 top-level components
- Medium Priority: 14 top-level components

**By Category:**
- Advanced Data Components: 12
- Data Display: 10
- Stepper & Progress: 8
- Advanced Inputs: 8
- Feedback Components: 8
- Layout Components: 6
- Navigation Components: 6
- Utility Components: 6
- Surface Components: 5

**Key Differentiators from shadcn/ui:**
- **DataGrid** - Enterprise-grade data table with advanced features
- **TreeView** - Hierarchical data visualization
- **Timeline** - Material Design timeline component
- **Stepper** - Multi-step process indicator
- **SpeedDial** - FAB with action menu
- **Rating** - Star rating with half-star precision
- **TransferList** - Dual-list selector
- **BottomNavigation** - Mobile navigation pattern
- **ImageList** - Masonry image grid
- **Autocomplete** - Advanced typeahead with virtualization

**Recommended Initial Implementation: Top 15 High Priority Components**
1. DataGrid
2. TreeView (with TreeItem)
3. Timeline (with sub-components)
4. Stepper (with Step, StepLabel)
5. Rating
6. SpeedDial (with actions)
7. Breadcrumbs
8. ImageList (with items)
9. Pagination
10. Autocomplete
11. BottomNavigation (for mobile UIs)
12. Skeleton
13. Tooltip (Material variant)
14. Grid (Material Design system)
15. Chip

**Integration Strategy:**
- Import from `@mui/material` and `@mui/x-data-grid`
- Wrap in our component schema system
- Support Material Design theming
- Ensure responsive behavior
- Maintain accessibility features

**Dependencies Required:**
```json
{
  "@mui/material": "^5.15.0",
  "@mui/x-data-grid": "^6.19.0",
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0"
}
```

**Special Considerations:**

**DataGrid:**
- Free version supports basic features
- Pro/Premium versions offer advanced features
- Consider starting with free DataGrid
- Virtualization for large datasets

**Theme Integration:**
- Material UI uses its own theming system
- Can coexist with Tailwind CSS
- Use `sx` prop for inline styling
- Consider creating Material theme matching our design system

**Accessibility:**
- Material UI components are WCAG compliant
- Built-in keyboard navigation
- ARIA attributes included
- Focus management

**Performance:**
- Components are optimized but can be heavy
- Use code splitting for DataGrid
- Consider lazy loading for complex components
- Tree shaking reduces bundle size

**Note:** Material UI provides comprehensive, production-ready components with excellent accessibility and mobile support. Focus on components that complement shadcn/ui rather than duplicate functionality.
