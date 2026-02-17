/**
 * MCP Server Implementation - Chakra UI
 * 
 * This module provides a complete MCP server implementation for Chakra UI,
 * including all components with their props, theming system, and accessibility features.
 */

import {
  MCPComponentDefinition,
  MCPRegistryManifest,
  MCPTool,
  MCPToolCallResult,
  MCPResource,
  MCPResourceContents,
} from '../types';

// ============================================================================
// Component Definitions
// ============================================================================

const CHAKRA_COMPONENTS: MCPComponentDefinition[] = [
  {
    name: 'button',
    description: 'Button component with variants, sizes, and color schemes',
    category: 'input',
    install: {
      command: 'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion',
      dependencies: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'solid',
        description: 'The visual style of the button',
        enumValues: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the button',
        enumValues: ['xs', 'sm', 'md', 'lg'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'gray',
        description: 'The color scheme of the button',
        enumValues: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'],
      },
      {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the button will show a spinner',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the button will be disabled',
      },
      {
        name: 'loadingText',
        type: 'string',
        required: false,
        description: 'The label to show in the button when isLoading is true',
      },
      {
        name: 'leftIcon',
        type: 'ReactElement',
        required: false,
        description: 'If added, the button will show an icon before the button label',
      },
      {
        name: 'rightIcon',
        type: 'ReactElement',
        required: false,
        description: 'If added, the button will show an icon after the button label',
      },
      {
        name: 'onClick',
        type: 'function',
        required: false,
        description: 'Function called when the button is clicked',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'The content of the button',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Button>Click me</Button>`,
        description: 'Default solid button',
      },
      {
        name: 'variants',
        code: `<Stack direction='row' spacing={4} align='center'>
  <Button colorScheme='teal' variant='solid'>Solid</Button>
  <Button colorScheme='teal' variant='outline'>Outline</Button>
  <Button colorScheme='teal' variant='ghost'>Ghost</Button>
  <Button colorScheme='teal' variant='link'>Link</Button>
</Stack>`,
        description: 'All button variants',
      },
      {
        name: 'sizes',
        code: `<Stack direction='row' spacing={4} align='center'>
  <Button colorScheme='teal' size='xs'>Extra Small</Button>
  <Button colorScheme='teal' size='sm'>Small</Button>
  <Button colorScheme='teal' size='md'>Medium</Button>
  <Button colorScheme='teal' size='lg'>Large</Button>
</Stack>`,
        description: 'All button sizes',
      },
      {
        name: 'loading',
        code: `<Button isLoading colorScheme='teal' variant='solid'>
  Submit
</Button>`,
        description: 'Loading state',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['button'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'box',
    description: 'The most abstract component on top of which all other Chakra UI components are built. It renders a div element by default.',
    category: 'layout',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'as',
        type: 'string | Component',
        required: false,
        description: 'The element to render',
      },
      {
        name: 'p',
        type: 'string | number',
        required: false,
        description: 'Padding',
      },
      {
        name: 'm',
        type: 'string | number',
        required: false,
        description: 'Margin',
      },
      {
        name: 'bg',
        type: 'string',
        required: false,
        description: 'Background color',
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        description: 'Text color',
      },
      {
        name: 'borderRadius',
        type: 'string | number',
        required: false,
        description: 'Border radius',
      },
      {
        name: 'shadow',
        type: 'string',
        required: false,
        description: 'Box shadow',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Box content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Box bg='tomato' w='100%' p={4} color='white'>
  This is the Box
</Box>`,
        description: 'Basic box with background',
      },
      {
        name: 'as-prop',
        code: `<Box as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8}>
  Button
</Box>`,
        description: 'Using as prop to render as button',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: [],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'stack',
    description: 'A component to stack elements with consistent spacing',
    category: 'layout',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'direction',
        type: 'string | array',
        required: false,
        default: 'column',
        description: 'The direction to stack the elements',
        enumValues: ['row', 'column'],
      },
      {
        name: 'spacing',
        type: 'string | number',
        required: false,
        default: '0.5rem',
        description: 'The space between each stack item',
      },
      {
        name: 'align',
        type: 'string',
        required: false,
        description: 'The alignment of the stack items',
        enumValues: ['start', 'center', 'end', 'stretch'],
      },
      {
        name: 'justify',
        type: 'string',
        required: false,
        description: 'The justification of the stack items',
        enumValues: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      },
      {
        name: 'divider',
        type: 'ReactElement',
        required: false,
        description: 'If provided, each stack item will show a divider',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Stack content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Stack spacing={4}>
  <Box h='40px' bg='yellow.200'>1</Box>
  <Box h='40px' bg='tomato'>2</Box>
  <Box h='40px' bg='pink.100'>3</Box>
</Stack>`,
        description: 'Vertical stack',
      },
      {
        name: 'horizontal',
        code: `<Stack direction='row' spacing={4}>
  <Box w='40px' h='40px' bg='yellow.200'>1</Box>
  <Box w='40px' h='40px' bg='tomato'>2</Box>
  <Box w='40px' h='40px' bg='pink.100'>3</Box>
</Stack>`,
        description: 'Horizontal stack',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['group'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'modal',
    description: 'Modal dialog component with overlay and focus management',
    category: 'overlay',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: true,
        description: 'If true, the modal will be open',
      },
      {
        name: 'onClose',
        type: 'function',
        required: true,
        description: 'Callback invoked to close the modal',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the modal',
        enumValues: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      },
      {
        name: 'isCentered',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the modal will be centered on screen',
      },
      {
        name: 'closeOnOverlayClick',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the modal will close when the overlay is clicked',
      },
      {
        name: 'closeOnEsc',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the modal will close when the Esc key is pressed',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Modal content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const { isOpen, onOpen, onClose } = useDisclosure()

return (
  <>
    <Button onClick={onOpen}>Open Modal</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Modal content goes here.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
)`,
        description: 'Complete modal example',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['dialog'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'input',
    description: 'Form input component with various states and sizes',
    category: 'input',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the input',
        enumValues: ['xs', 'sm', 'md', 'lg'],
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'outline',
        description: 'The variant of the input',
        enumValues: ['outline', 'filled', 'flushed', 'unstyled'],
      },
      {
        name: 'isInvalid',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the input will indicate an error',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the input will be disabled',
      },
      {
        name: 'isReadOnly',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the input will be read-only',
      },
      {
        name: 'isRequired',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the input will be required',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder text',
      },
      {
        name: 'value',
        type: 'string | number',
        required: false,
        description: 'The value of the input',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Change event handler',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Input placeholder='Basic usage' />`,
        description: 'Basic input',
      },
      {
        name: 'sizes',
        code: `<Stack spacing={3}>
  <Input placeholder='extra small size' size='xs' />
  <Input placeholder='small size' size='sm' />
  <Input placeholder='medium size' size='md' />
  <Input placeholder='large size' size='lg' />
</Stack>`,
        description: 'All input sizes',
      },
      {
        name: 'variants',
        code: `<Stack spacing={3}>
  <Input variant='outline' placeholder='Outline' />
  <Input variant='filled' placeholder='Filled' />
  <Input variant='flushed' placeholder='Flushed' />
  <Input variant='unstyled' placeholder='Unstyled' />
</Stack>`,
        description: 'All input variants',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['textbox'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'select',
    description: 'Native select component with styling',
    category: 'input',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the select',
        enumValues: ['xs', 'sm', 'md', 'lg'],
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'outline',
        description: 'The variant of the select',
        enumValues: ['outline', 'filled', 'flushed', 'unstyled'],
      },
      {
        name: 'isInvalid',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the select will indicate an error',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the select will be disabled',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder option',
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'The value of the select',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Change event handler',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Option elements',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Select placeholder='Select option'>
  <option value='option1'>Option 1</option>
  <option value='option2'>Option 2</option>
  <option value='option3'>Option 3</option>
</Select>`,
        description: 'Basic select',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['combobox'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'tabs',
    description: 'Tabbed interface component with keyboard navigation',
    category: 'navigation',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'line',
        description: 'The variant of the tabs',
        enumValues: ['line', 'enclosed', 'enclosed-colored', 'soft-rounded', 'solid-rounded', 'unstyled'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the tabs',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'The color scheme of the tabs',
      },
      {
        name: 'index',
        type: 'number',
        required: false,
        description: 'Controlled selected tab index',
      },
      {
        name: 'defaultIndex',
        type: 'number',
        required: false,
        default: 0,
        description: 'Default selected tab index',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Tab change handler',
      },
      {
        name: 'isLazy',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, tabs will be mounted only when selected',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Tab panels and list',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Tabs>
  <TabList>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>`,
        description: 'Complete tabs example',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['tablist'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'accordion',
    description: 'Collapsible content sections with accessibility support',
    category: 'display',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'allowMultiple',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, multiple items can be expanded at once',
      },
      {
        name: 'allowToggle',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, any expanded item may be collapsed again',
      },
      {
        name: 'index',
        type: 'number | number[]',
        required: false,
        description: 'Controlled expanded item index(es)',
      },
      {
        name: 'defaultIndex',
        type: 'number | number[]',
        required: false,
        description: 'Default expanded item index(es)',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Change handler for expanded items',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Accordion items',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Accordion>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left'>
          Section 1 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Section 1 content
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box as='span' flex='1' textAlign='left'>
          Section 2 title
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Section 2 content
    </AccordionPanel>
  </AccordionItem>
</Accordion>`,
        description: 'Basic accordion',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['region'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'tooltip',
    description: 'Informational popup on hover with accessibility',
    category: 'overlay',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'label',
        type: 'string | ReactNode',
        required: true,
        description: 'The content of the tooltip',
      },
      {
        name: 'placement',
        type: 'string',
        required: false,
        default: 'bottom',
        description: 'The placement of the tooltip',
        enumValues: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'],
      },
      {
        name: 'hasArrow',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the tooltip will show an arrow',
      },
      {
        name: 'isOpen',
        type: 'boolean',
        required: false,
        description: 'Controlled open state',
      },
      {
        name: 'closeOnClick',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the tooltip will close on click',
      },
      {
        name: 'closeOnMouseDown',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the tooltip will close on mouse down',
      },
      {
        name: 'children',
        type: 'ReactElement',
        required: true,
        description: 'The element to attach the tooltip to',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Tooltip label='Hover me'>
  <Button>Hover me</Button>
</Tooltip>`,
        description: 'Basic tooltip',
      },
      {
        name: 'with-arrow',
        code: `<Tooltip hasArrow label='Search places' bg='gray.300' color='black'>
  <SearchIcon />
</Tooltip>`,
        description: 'Tooltip with arrow',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['tooltip'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'badge',
    description: 'Status indicator or label component',
    category: 'display',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'subtle',
        description: 'The variant of the badge',
        enumValues: ['solid', 'subtle', 'outline'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'gray',
        description: 'The color scheme of the badge',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Badge content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Badge>Default</Badge>`,
        description: 'Default badge',
      },
      {
        name: 'variants',
        code: `<Stack direction='row'>
  <Badge variant='outline' colorScheme='green'>Success</Badge>
  <Badge variant='solid' colorScheme='green'>Success</Badge>
  <Badge variant='subtle' colorScheme='green'>Success</Badge>
</Stack>`,
        description: 'All badge variants',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['status'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'avatar',
    description: 'User profile image or initials component',
    category: 'display',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the avatar',
        enumValues: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: 'The name of the user (used for initials)',
      },
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'The image source URL',
      },
      {
        name: 'icon',
        type: 'ReactElement',
        required: false,
        description: 'Icon to show when no image or name is provided',
      },
      {
        name: 'showBorder',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the avatar will have a border',
      },
      {
        name: 'borderColor',
        type: 'string',
        required: false,
        description: 'Border color',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />`,
        description: 'Avatar with image',
      },
      {
        name: 'sizes',
        code: `<Stack direction='row'>
  <Avatar size='2xs' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='xs' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='md' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='lg' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='xl' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
  <Avatar size='2xl' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
</Stack>`,
        description: 'All avatar sizes',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['img'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'table',
    description: 'Data table component with sorting and selection support',
    category: 'data',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'simple',
        description: 'The variant of the table',
        enumValues: ['simple', 'striped', 'unstyled'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the table',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        description: 'The color scheme for striped variant',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Table content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Table variant='simple'>
  <Thead>
    <Tr>
      <Th>Name</Th>
      <Th>Role</Th>
      <Th isNumeric>Amount</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>John Doe</Td>
      <Td>Admin</Td>
      <Td isNumeric>25.4</Td>
    </Tr>
    <Tr>
      <Td>Jane Smith</Td>
      <Td>User</Td>
      <Td isNumeric>30.48</Td>
    </Tr>
  </Tbody>
</Table>`,
        description: 'Complete table example',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['table'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'switch',
    description: 'Toggle switch control with accessibility',
    category: 'input',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the switch',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'The color scheme of the switch',
      },
      {
        name: 'isChecked',
        type: 'boolean',
        required: false,
        description: 'Controlled checked state',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        required: false,
        description: 'Default checked state',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Change handler',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the switch will be disabled',
      },
      {
        name: 'isRequired',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the switch will be required',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<FormControl display='flex' alignItems='center'>
  <FormLabel htmlFor='email-alerts' mb='0'>
    Enable email alerts?
  </FormLabel>
  <Switch id='email-alerts' />
</FormControl>`,
        description: 'Switch with label',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['switch'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'slider',
    description: 'Range slider control with multiple thumbs support',
    category: 'input',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'value',
        type: 'number',
        required: false,
        description: 'Controlled value',
      },
      {
        name: 'defaultValue',
        type: 'number',
        required: false,
        description: 'Default value',
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        default: 0,
        description: 'Minimum value',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: 100,
        description: 'Maximum value',
      },
      {
        name: 'step',
        type: 'number',
        required: false,
        default: 1,
        description: 'Step increment',
      },
      {
        name: 'onChange',
        type: 'function',
        required: false,
        description: 'Value change handler',
      },
      {
        name: 'onChangeEnd',
        type: 'function',
        required: false,
        description: 'Handler called when slider value change is complete',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the slider will be disabled',
      },
      {
        name: 'orientation',
        type: 'string',
        required: false,
        default: 'horizontal',
        description: 'The orientation of the slider',
        enumValues: ['horizontal', 'vertical'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Slider aria-label='slider-ex-1' defaultValue={30}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>`,
        description: 'Basic slider',
      },
      {
        name: 'with-label',
        code: `<Slider defaultValue={60} min={0} max={300} step={30}>
  <SliderTrack bg='red.100'>
    <SliderFilledTrack bg='tomato' />
  </SliderTrack>
  <SliderThumb boxSize={6}>
    <Box color='tomato' as={MdGraphicEq} />
  </SliderThumb>
</Slider>`,
        description: 'Custom styled slider',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['slider'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'progress',
    description: 'Progress indicator with linear and circular variants',
    category: 'feedback',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'value',
        type: 'number',
        required: false,
        description: 'Current progress value',
      },
      {
        name: 'min',
        type: 'number',
        required: false,
        default: 0,
        description: 'Minimum value',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        default: 100,
        description: 'Maximum value',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'The size of the progress',
        enumValues: ['xs', 'sm', 'md', 'lg'],
      },
      {
        name: 'colorScheme',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'The color scheme of the progress',
      },
      {
        name: 'isIndeterminate',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the progress will be indeterminate',
      },
      {
        name: 'hasStripe',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the progress bar will have a stripe',
      },
      {
        name: 'isAnimated',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, and hasStripe is true, the stripes will be animated',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Progress value={80} />`,
        description: 'Basic progress bar',
      },
      {
        name: 'with-stripe',
        code: `<Progress value={64} hasStripe />`,
        description: 'Progress with stripes',
      },
      {
        name: 'indeterminate',
        code: `<Progress size='xs' isIndeterminate />`,
        description: 'Indeterminate progress',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['progressbar'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'skeleton',
    description: 'Loading placeholder with animation',
    category: 'feedback',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'isLoaded',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the skeleton will be replaced by the children',
      },
      {
        name: 'speed',
        type: 'number',
        required: false,
        default: 0.8,
        description: 'The animation speed in seconds',
      },
      {
        name: 'fadeDuration',
        type: 'number',
        required: false,
        default: 0.4,
        description: 'The fade duration in seconds',
      },
      {
        name: 'startColor',
        type: 'string',
        required: false,
        description: 'The start color of the animation',
      },
      {
        name: 'endColor',
        type: 'string',
        required: false,
        description: 'The end color of the animation',
      },
      {
        name: 'height',
        type: 'string | number',
        required: false,
        description: 'The height of the skeleton',
      },
      {
        name: 'width',
        type: 'string | number',
        required: false,
        description: 'The width of the skeleton',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Content to show when loaded',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Stack>
  <Skeleton height='20px' />
  <Skeleton height='20px' />
  <Skeleton height='20px' />
</Stack>`,
        description: 'Basic skeleton lines',
      },
      {
        name: 'with-content',
        code: `<Skeleton isLoaded={isLoaded}>
  <span>Content loaded!</span>
</Skeleton>`,
        description: 'Skeleton with loaded content',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['status'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'toast',
    description: 'Notification message system with positioning and variants',
    category: 'feedback',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'The title of the toast',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'The description of the toast',
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'The status of the toast',
        enumValues: ['info', 'success', 'warning', 'error', 'loading'],
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 5000,
        description: 'Duration in milliseconds',
      },
      {
        name: 'isClosable',
        type: 'boolean',
        required: false,
        default: false,
        description: 'If true, the toast will show a close button',
      },
      {
        name: 'position',
        type: 'string',
        required: false,
        default: 'bottom',
        description: 'The position of the toast',
        enumValues: ['top', 'top-right', 'top-left', 'bottom', 'bottom-right', 'bottom-left'],
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'The variant of the toast',
        enumValues: ['solid', 'subtle', 'left-accent', 'top-accent'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const toast = useToast()

return (
  <Button
    onClick={() =>
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
  >
    Show Toast
  </Button>
)`,
        description: 'Success toast',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['status'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'menu',
    description: 'Contextual menu component with keyboard navigation',
    category: 'navigation',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: false,
        description: 'Controlled open state',
      },
      {
        name: 'onOpen',
        type: 'function',
        required: false,
        description: 'Callback when menu opens',
      },
      {
        name: 'onClose',
        type: 'function',
        required: false,
        description: 'Callback when menu closes',
      },
      {
        name: 'autoSelect',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the first menu item will receive focus when the menu opens',
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the menu will close when a menu item is clicked',
      },
      {
        name: 'closeOnBlur',
        type: 'boolean',
        required: false,
        default: true,
        description: 'If true, the menu will close on outside click',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Menu content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Menu>
  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    Actions
  </MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuItem>Mark as Draft</MenuItem>
    <MenuDivider />
    <MenuItem>Delete</MenuItem>
  </MenuList>
</Menu>`,
        description: 'Complete menu example',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['menu'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'divider',
    description: 'Visual divider with horizontal and vertical orientations',
    category: 'layout',
    install: {
      command: 'npm install @chakra-ui/react',
      dependencies: ['@chakra-ui/react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'orientation',
        type: 'string',
        required: false,
        default: 'horizontal',
        description: 'The orientation of the divider',
        enumValues: ['horizontal', 'vertical'],
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'The variant of the divider',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Stack spacing={4}>
  <span>Content above</span>
  <Divider />
  <span>Content below</span>
</Stack>`,
        description: 'Horizontal divider',
      },
      {
        name: 'vertical',
        code: `<Center height='50px'>
  <Divider orientation='vertical' />
</Center>`,
        description: 'Vertical divider',
      },
    ],
    registry: 'chakra',
    version: '3.0.0',
    styling: {
      tailwindClasses: [],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['separator'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
];

// ============================================================================
// Registry Manifest
// ============================================================================

export const CHAKRA_REGISTRY_MANIFEST: MCPRegistryManifest = {
  name: 'chakra',
  version: '3.0.0',
  description: 'Simple, modular and accessible component library for React',
  components: CHAKRA_COMPONENTS,
  capabilities: {
    supportsStreaming: true,
    supportsTheming: true,
    supportsCustomization: true,
    supportsAsyncInstall: true,
  },
  config: {
    baseUrl: 'https://mcp.chakra-ui.com',
    auth: {
      type: 'none',
      required: false,
    },
  },
  serverInfo: {
    name: 'chakra-mcp-server',
    version: '1.0.0',
  },
};

// ============================================================================
// Tool Definitions
// ============================================================================

export const CHAKRA_TOOLS: MCPTool[] = [
  {
    name: 'list_components',
    description: 'List all available Chakra UI components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category',
        },
      },
    },
  },
  {
    name: 'get_component',
    description: 'Get detailed information about a specific component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_install_command',
    description: 'Get the installation command for Chakra UI',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific components to install (optional)',
        },
      },
    },
  },
  {
    name: 'search_components',
    description: 'Search for components by name or description',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_theme_config',
    description: 'Get Chakra UI theme configuration guide',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

export async function handleChakraTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolCallResult> {
  switch (toolName) {
    case 'list_components': {
      const category = args.category as string | undefined;
      let components = CHAKRA_COMPONENTS;
      
      if (category) {
        components = components.filter(c => c.category === category);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(components.map(c => ({
              name: c.name,
              description: c.description,
              category: c.category,
            }))),
          },
        ],
      };
    }

    case 'get_component': {
      const name = args.name as string;
      const component = CHAKRA_COMPONENTS.find(c => c.name === name);

      if (!component) {
        return {
          content: [{ type: 'text', text: `Component not found: ${name}` }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    }

    case 'get_install_command': {
      return {
        content: [
          {
            type: 'text',
            text: 'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion',
          },
        ],
      };
    }

    case 'search_components': {
      const query = (args.query as string).toLowerCase();
      const results = CHAKRA_COMPONENTS.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results.map(c => ({
              name: c.name,
              description: c.description,
              category: c.category,
            }))),
          },
        ],
      };
    }

    case 'get_theme_config': {
      const themeConfig = {
        setup: `
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0eaff',
      100: '#d4c2ff',
      500: '#805ad5',
      900: '#44337a',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <YourApp />
    </ChakraProvider>
  )
}`,
        components: 'Wrap your app with ChakraProvider to enable theming',
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(themeConfig, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
  }
}

// ============================================================================
// Resource Definitions
// ============================================================================

export const CHAKRA_RESOURCES: MCPResource[] = [
  {
    uri: 'registry://manifest',
    name: 'Registry Manifest',
    description: 'Complete registry manifest with all components',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://components',
    name: 'Component List',
    description: 'List of all available components',
    mimeType: 'application/json',
  },
  {
    uri: 'registry://theme/tokens',
    name: 'Theme Tokens',
    description: 'Chakra UI theme tokens and design system',
    mimeType: 'application/json',
  },
  ...CHAKRA_COMPONENTS.map(c => ({
    uri: `registry://components/${c.name}`,
    name: c.name,
    description: c.description,
    mimeType: 'application/json',
  })),
];

// ============================================================================
// Resource Handlers
// ============================================================================

export async function handleChakraResource(uri: string): Promise<MCPResourceContents> {
  if (uri === 'registry://manifest') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(CHAKRA_REGISTRY_MANIFEST, null, 2),
    };
  }

  if (uri === 'registry://components') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(CHAKRA_COMPONENTS.map(c => ({
        name: c.name,
        description: c.description,
        category: c.category,
      }))),
    };
  }

  if (uri === 'registry://theme/tokens') {
    const themeTokens = {
      colors: {
        gray: { 50: '#F7FAFC', 100: '#EDF2F7', 200: '#E2E8F0', 300: '#CBD5E0', 400: '#A0AEC0', 500: '#718096', 600: '#4A5568', 700: '#2D3748', 800: '#1A202C', 900: '#171923' },
        red: { 50: '#FFF5F5', 100: '#FED7D7', 200: '#FEB2B2', 300: '#FC8181', 400: '#F56565', 500: '#E53E3E', 600: '#C53030', 700: '#9B2C2C', 800: '#822727', 900: '#63171B' },
        blue: { 50: '#EBF8FF', 100: '#BEE3F8', 200: '#90CDF4', 300: '#63B3ED', 400: '#4299E1', 500: '#3182CE', 600: '#2B6CB0', 700: '#2C5282', 800: '#2A4365', 900: '#1A365D' },
      },
      space: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' },
      radii: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
    };

    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(themeTokens, null, 2),
    };
  }

  const componentMatch = uri.match(/^registry:\/\/components\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    const component = CHAKRA_COMPONENTS.find(c => c.name === componentName);

    if (component) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(component, null, 2),
      };
    }
  }

  throw new Error(`Resource not found: ${uri}`);
}

// ============================================================================
// Server Factory
// ============================================================================

export function createChakraMCPServer() {
  return {
    manifest: CHAKRA_REGISTRY_MANIFEST,
    tools: CHAKRA_TOOLS,
    resources: CHAKRA_RESOURCES,
    handleTool: handleChakraTool,
    handleResource: handleChakraResource,
  };
}

export default createChakraMCPServer;
