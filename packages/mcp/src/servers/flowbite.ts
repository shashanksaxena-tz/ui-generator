/**
 * MCP Server Implementation - Flowbite
 * 
 * This module provides a complete MCP server implementation for Flowbite,
 * featuring Tailwind CSS components with Figma design system integration.
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

const FLOWBITE_COMPONENTS: MCPComponentDefinition[] = [
  {
    name: 'button',
    description: 'Button component with multiple variants, sizes, and colors',
    category: 'input',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'color',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'Button color theme',
        enumValues: ['blue', 'gray', 'red', 'yellow', 'green', 'indigo', 'purple', 'pink', 'light', 'dark'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Button size',
        enumValues: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      {
        name: 'pill',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Use pill style (fully rounded)',
      },
      {
        name: 'outline',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Use outline style',
      },
      {
        name: 'gradientDuoTone',
        type: 'string',
        required: false,
        description: 'Gradient color combination',
        enumValues: ['cyanToBlue', 'greenToBlue', 'purpleToBlue', 'purpleToPink', 'pinkToOrange', 'tealToLime', 'redToYellow'],
      },
      {
        name: 'gradientMonochrome',
        type: 'string',
        required: false,
        description: 'Monochrome gradient color',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Disable the button',
      },
      {
        name: 'isProcessing',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Show processing/loading state',
      },
      {
        name: 'processingLabel',
        type: 'string',
        required: false,
        description: 'Label shown during processing',
      },
      {
        name: 'onClick',
        type: 'function',
        required: false,
        description: 'Click event handler',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: false,
        description: 'Button content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Button>Default Button</Button>`,
        description: 'Default blue button',
      },
      {
        name: 'colors',
        code: `<div className="flex flex-wrap gap-2">
  <Button color="blue">Blue</Button>
  <Button color="gray">Gray</Button>
  <Button color="red">Red</Button>
  <Button color="green">Green</Button>
  <Button color="yellow">Yellow</Button>
  <Button color="purple">Purple</Button>
</div>`,
        description: 'All button colors',
      },
      {
        name: 'gradient',
        code: `<Button gradientDuoTone="cyanToBlue">Cyan to Blue</Button>
<Button gradientDuoTone="greenToBlue">Green to Blue</Button>
<Button gradientDuoTone="purpleToPink">Purple to Pink</Button>`,
        description: 'Gradient buttons',
      },
      {
        name: 'outline',
        code: `<Button outline color="blue">Outline Blue</Button>
<Button outline color="red">Outline Red</Button>`,
        description: 'Outline style buttons',
      },
      {
        name: 'pill',
        code: `<Button pill>Pill Button</Button>
<Button pill outline color="purple">Pill Outline</Button>`,
        description: 'Pill style buttons',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'font-medium', 'rounded-lg', 'text-sm', 'px-5', 'py-2.5', 'text-center',
        'inline-flex', 'items-center', 'focus:ring-4', 'focus:outline-none',
      ],
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
    name: 'card',
    description: 'Card component for content containers',
    category: 'layout',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'href',
        type: 'string',
        required: false,
        description: 'URL for clickable card',
      },
      {
        name: 'horizontal',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Horizontal card layout',
      },
      {
        name: 'imgSrc',
        type: 'string',
        required: false,
        description: 'Card image URL',
      },
      {
        name: 'imgAlt',
        type: 'string',
        required: false,
        description: 'Card image alt text',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Card content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Card>
  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    Noteworthy technology acquisitions 2021
  </h5>
  <p className="font-normal text-gray-700 dark:text-gray-400">
    Here are the biggest enterprise technology acquisitions of 2021.
  </p>
</Card>`,
        description: 'Basic card',
      },
      {
        name: 'with-image',
        code: `<Card
  imgSrc="/images/blog/image-1.jpg"
  imgAlt="Meaningful alt text"
>
  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    Noteworthy technology acquisitions 2021
  </h5>
  <p className="font-normal text-gray-700 dark:text-gray-400">
    Here are the biggest enterprise technology acquisitions of 2021.
  </p>
</Card>`,
        description: 'Card with image',
      },
      {
        name: 'horizontal',
        code: `<Card horizontal imgSrc="/images/blog/image-4.jpg">
  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    Noteworthy technology acquisitions 2021
  </h5>
  <p className="font-normal text-gray-700 dark:text-gray-400">
    Here are the biggest enterprise technology acquisitions of 2021.
  </p>
</Card>`,
        description: 'Horizontal card layout',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'max-w-sm', 'bg-white', 'border', 'border-gray-200', 'rounded-lg',
        'shadow', 'dark:bg-gray-800', 'dark:border-gray-700',
      ],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['article'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'modal',
    description: 'Modal dialog component with customizable sizes',
    category: 'overlay',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'show',
        type: 'boolean',
        required: true,
        description: 'Control modal visibility',
      },
      {
        name: 'onClose',
        type: 'function',
        required: true,
        description: 'Close handler function',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Modal size',
        enumValues: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'],
      },
      {
        name: 'popup',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Use popup style (centered, smaller padding)',
      },
      {
        name: 'dismissible',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Allow closing by clicking outside or pressing Escape',
      },
      {
        name: 'initialFocus',
        type: 'number',
        required: false,
        description: 'Index of element to focus when modal opens',
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
        code: `const [openModal, setOpenModal] = useState(false);

return (
  <>
    <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Terms of Service</Modal.Header>
      <Modal.Body>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          With less than a month to go before the European Union enacts new
          consumer privacy laws...
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpenModal(false)}>I accept</Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);`,
        description: 'Complete modal example',
      },
      {
        name: 'sizes',
        code: `<Modal show={openModal} onClose={onClose} size="xl">
  <Modal.Header>Extra Large Modal</Modal.Header>
  <Modal.Body>
    <p>Content for extra large modal...</p>
  </Modal.Body>
</Modal>`,
        description: 'Different modal sizes',
      },
      {
        name: 'popup',
        code: `<Modal show={openModal} onClose={onClose} popup>
  <Modal.Header />
  <Modal.Body>
    <div className="text-center">
      <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
      <h3 className="mb-5 text-lg font-normal text-gray-500">
        Are you sure you want to delete this product?
      </h3>
      <div className="flex justify-center gap-4">
        <Button color="failure" onClick={onClose}>
          Yes, I am sure
        </Button>
        <Button color="gray" onClick={onClose}>
          No, cancel
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal>`,
        description: 'Popup confirmation modal',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'w-full', 'p-4',
        'overflow-x-hidden', 'overflow-y-auto', 'md:inset-0', 'h-[calc(100%-1rem)]',
        'max-h-full', 'flex', 'justify-center', 'items-center',
      ],
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
    name: 'text-input',
    description: 'Text input component with various styles and states',
    category: 'input',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Input ID',
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        default: 'text',
        description: 'Input type',
        enumValues: ['text', 'email', 'password', 'number', 'tel', 'url'],
      },
      {
        name: 'sizing',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Input size',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        description: 'Input color theme',
        enumValues: ['gray', 'info', 'failure', 'warning', 'success'],
      },
      {
        name: 'helperText',
        type: 'ReactNode',
        required: false,
        description: 'Helper text below input',
      },
      {
        name: 'addon',
        type: 'ReactNode',
        required: false,
        description: 'Addon content (prefix)',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        required: false,
        description: 'Icon to display inside input',
      },
      {
        name: 'rightIcon',
        type: 'ReactNode',
        required: false,
        description: 'Icon to display on right side',
      },
      {
        name: 'shadow',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Add shadow to input',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Disable the input',
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder text',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<TextInput id="email1" type="email" placeholder="name@flowbite.com" required />`,
        description: 'Basic email input',
      },
      {
        name: 'with-icon',
        code: `<TextInput
  id="email4"
  type="email"
  icon={HiMail}
  placeholder="name@flowbite.com"
  required
/>`,
        description: 'Input with icon',
      },
      {
        name: 'with-addon',
        code: `<TextInput
  id="website"
  type="url"
  addon="https://"
  placeholder="flowbite.com"
/>`,
        description: 'Input with addon prefix',
      },
      {
        name: 'validation',
        code: `<TextInput
  id="username"
  placeholder="Bonnie Green"
  required
  color="failure"
  helperText={
    <>
      <span className="font-medium">Oops!</span> Username already taken!
    </>
  }
/>`,
        description: 'Input with validation state',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm',
        'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full',
        'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400',
        'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500',
      ],
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
    description: 'Select dropdown component',
    category: 'input',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'id',
        type: 'string',
        required: false,
        description: 'Select ID',
      },
      {
        name: 'sizing',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Select size',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        description: 'Select color theme',
        enumValues: ['gray', 'info', 'failure', 'warning', 'success'],
      },
      {
        name: 'helperText',
        type: 'ReactNode',
        required: false,
        description: 'Helper text below select',
      },
      {
        name: 'addon',
        type: 'ReactNode',
        required: false,
        description: 'Addon content',
      },
      {
        name: 'shadow',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Add shadow to select',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Disable the select',
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
        code: `<Select id="countries" required>
  <option>United States</option>
  <option>Canada</option>
  <option>France</option>
  <option>Germany</option>
</Select>`,
        description: 'Basic select',
      },
      {
        name: 'with-addon',
        code: `<Select id="countries" addon="Country">
  <option>United States</option>
  <option>Canada</option>
</Select>`,
        description: 'Select with addon',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm',
        'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'w-full',
        'dark:bg-gray-700', 'dark:border-gray-600', 'dark:placeholder-gray-400',
        'dark:text-white', 'dark:focus:ring-blue-500', 'dark:focus:border-blue-500',
      ],
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
    description: 'Tabbed navigation component',
    category: 'navigation',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'aria-label',
        type: 'string',
        required: false,
        description: 'ARIA label for tabs',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Tab style variant',
        enumValues: ['default', 'pills', 'underline', 'fullWidth'],
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Tab items and content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Tabs aria-label="Default tabs">
  <Tabs.Item active title="Profile" icon={HiUserCircle}>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      This is some placeholder content for the Profile tab.
    </p>
  </Tabs.Item>
  <Tabs.Item title="Dashboard" icon={HiAdjustments}>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      This is some placeholder content for the Dashboard tab.
    </p>
  </Tabs.Item>
  <Tabs.Item title="Settings" icon={HiClipboardList}>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      This is some placeholder content for the Settings tab.
    </p>
  </Tabs.Item>
</Tabs>`,
        description: 'Default tabs with icons',
      },
      {
        name: 'pills',
        code: `<Tabs aria-label="Pills" style="pills">
  <Tabs.Item active title="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item title="Tab 2">Content 2</Tabs.Item>
  <Tabs.Item title="Tab 3">Content 3</Tabs.Item>
</Tabs>`,
        description: 'Pill style tabs',
      },
      {
        name: 'underline',
        code: `<Tabs aria-label="Underline" style="underline">
  <Tabs.Item active title="Tab 1">Content 1</Tabs.Item>
  <Tabs.Item title="Tab 2">Content 2</Tabs.Item>
  <Tabs.Item title="Tab 3">Content 3</Tabs.Item>
</Tabs>`,
        description: 'Underline style tabs',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'flex-wrap', '-mb-px', 'text-sm', 'font-medium', 'text-center',
        'text-gray-500', 'border-b', 'border-gray-200', 'dark:text-gray-400',
        'dark:border-gray-700',
      ],
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
    description: 'Collapsible content sections',
    category: 'display',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'alwaysOpen',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Allow multiple items to be open simultaneously',
      },
      {
        name: 'flush',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Remove default styling for nested accordions',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Accordion panels',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Accordion>
  <Accordion.Panel>
    <Accordion.Title>What is Flowbite?</Accordion.Title>
    <Accordion.Content>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        Flowbite is an open-source library of interactive components built on top of Tailwind CSS.
      </p>
    </Accordion.Content>
  </Accordion.Panel>
  <Accordion.Panel>
    <Accordion.Title>Is there a Figma file available?</Accordion.Title>
    <Accordion.Content>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        Flowbite is first conceptualized and designed using the Figma software.
      </p>
    </Accordion.Content>
  </Accordion.Panel>
</Accordion>`,
        description: 'Basic accordion',
      },
      {
        name: 'always-open',
        code: `<Accordion alwaysOpen>
  <Accordion.Panel>
    <Accordion.Title>Panel 1</Accordion.Title>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Panel>
  <Accordion.Panel>
    <Accordion.Title>Panel 2</Accordion.Title>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Panel>
</Accordion>`,
        description: 'Accordion allowing multiple open panels',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'divide-y', 'divide-gray-200', 'border-gray-200', 'dark:divide-gray-700',
        'dark:border-gray-700',
      ],
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
    description: 'Informational popup on hover',
    category: 'overlay',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'content',
        type: 'ReactNode',
        required: true,
        description: 'Tooltip content',
      },
      {
        name: 'placement',
        type: 'string',
        required: false,
        default: 'top',
        description: 'Tooltip position',
        enumValues: ['top', 'bottom', 'left', 'right'],
      },
      {
        name: 'trigger',
        type: 'string',
        required: false,
        default: 'hover',
        description: 'Trigger event',
        enumValues: ['hover', 'click'],
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        default: 'light',
        description: 'Tooltip style',
        enumValues: ['light', 'dark'],
      },
      {
        name: 'animation',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Enable animation',
      },
      {
        name: 'arrow',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Show arrow',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Element to attach tooltip to',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Tooltip content="Tooltip content">
  <Button>Hover me</Button>
</Tooltip>`,
        description: 'Basic tooltip',
      },
      {
        name: 'placement',
        code: `<div className="flex gap-4">
  <Tooltip content="Top tooltip" placement="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip content="Right tooltip" placement="right">
    <Button>Right</Button>
  </Tooltip>
  <Tooltip content="Bottom tooltip" placement="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Left tooltip" placement="left">
    <Button>Left</Button>
  </Tooltip>
</div>`,
        description: 'Different tooltip placements',
      },
      {
        name: 'click-trigger',
        code: `<Tooltip content="Click tooltip" trigger="click">
  <Button>Click me</Button>
</Tooltip>`,
        description: 'Click-triggered tooltip',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'absolute', 'z-10', 'inline-block', 'px-3', 'py-2', 'text-sm', 'font-medium',
        'text-white', 'bg-gray-900', 'rounded-lg', 'shadow-sm', 'tooltip',
        'dark:bg-gray-700',
      ],
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
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'color',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'Badge color',
        enumValues: ['blue', 'gray', 'red', 'green', 'yellow', 'indigo', 'purple', 'pink'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Badge size',
        enumValues: ['xs', 'sm', 'md'],
      },
      {
        name: 'href',
        type: 'string',
        required: false,
        description: 'URL for clickable badge',
      },
      {
        name: 'icon',
        type: 'ReactNode',
        required: false,
        description: 'Icon to display',
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
        code: `<Badge>Default</Badge>
<Badge color="gray">Gray</Badge>
<Badge color="red">Red</Badge>
<Badge color="green">Green</Badge>
<Badge color="yellow">Yellow</Badge>
<Badge color="indigo">Indigo</Badge>
<Badge color="purple">Purple</Badge>
<Badge color="pink">Pink</Badge>`,
        description: 'All badge colors',
      },
      {
        name: 'with-icon',
        code: `<Badge icon={HiCheck}>Completed</Badge>
<Badge color="gray" icon={HiClock}>Pending</Badge>`,
        description: 'Badges with icons',
      },
      {
        name: 'sizes',
        code: `<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`,
        description: 'Badge sizes',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded', 'text-xs',
        'font-medium', 'bg-blue-100', 'text-blue-800', 'dark:bg-blue-200',
        'dark:text-blue-800',
      ],
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
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Image alt text',
      },
      {
        name: 'img',
        type: 'string',
        required: false,
        description: 'Image source URL',
      },
      {
        name: 'initials',
        type: 'string',
        required: false,
        description: 'Initials to display when no image',
      },
      {
        name: 'rounded',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Fully rounded avatar',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Avatar size',
        enumValues: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      {
        name: 'stacked',
        type: 'boolean',
        required: false,
        default: false,
        description: 'For stacked avatar groups',
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Status indicator',
        enumValues: ['away', 'busy', 'offline', 'online'],
      },
      {
        name: 'statusPosition',
        type: 'string',
        required: false,
        default: 'bottom-right',
        description: 'Position of status indicator',
        enumValues: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Avatar img="/images/people/profile-picture-5.jpg" rounded />`,
        description: 'Rounded avatar with image',
      },
      {
        name: 'placeholder',
        code: `<Avatar rounded initials="JL" />`,
        description: 'Avatar with initials placeholder',
      },
      {
        name: 'status',
        code: `<Avatar
  img="/images/people/profile-picture-5.jpg"
  status="online"
  statusPosition="bottom-right"
  rounded
/>`,
        description: 'Avatar with status indicator',
      },
      {
        name: 'stacked',
        code: `<Avatar.Group>
  <Avatar img="/images/people/profile-picture-1.jpg" rounded stacked />
  <Avatar img="/images/people/profile-picture-2.jpg" rounded stacked />
  <Avatar img="/images/people/profile-picture-3.jpg" rounded stacked />
  <Avatar.Counter total={99} href="#" />
</Avatar.Group>`,
        description: 'Stacked avatar group',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'w-10', 'h-10', 'rounded', 'bg-gray-100', 'dark:bg-gray-600',
      ],
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
    description: 'Data table component with sorting and pagination',
    category: 'data',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'hoverable',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Add hover effect to rows',
      },
      {
        name: 'striped',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Add zebra-striping to rows',
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
        code: `<Table>
  <Table.Head>
    <Table.HeadCell>Product name</Table.HeadCell>
    <Table.HeadCell>Color</Table.HeadCell>
    <Table.HeadCell>Category</Table.HeadCell>
    <Table.HeadCell>Price</Table.HeadCell>
    <Table.HeadCell>
      <span className="sr-only">Edit</span>
    </Table.HeadCell>
  </Table.Head>
  <Table.Body className="divide-y">
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        Apple MacBook Pro 17"
      </Table.Cell>
      <Table.Cell>Sliver</Table.Cell>
      <Table.Cell>Laptop</Table.Cell>
      <Table.Cell>$2999</Table.Cell>
      <Table.Cell>
        <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
          Edit
        </a>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`,
        description: 'Basic table',
      },
      {
        name: 'striped',
        code: `<Table striped>
  <Table.Head>
    <Table.HeadCell>Product name</Table.HeadCell>
    <Table.HeadCell>Color</Table.HeadCell>
    <Table.HeadCell>Category</Table.HeadCell>
    <Table.HeadCell>Price</Table.HeadCell>
  </Table.Head>
  <Table.Body className="divide-y">
    {/* Table rows */}
  </Table.Body>
</Table>`,
        description: 'Striped table',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'w-full', 'text-sm', 'text-left', 'text-gray-500', 'dark:text-gray-400',
      ],
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
    name: 'toggle-switch',
    description: 'Toggle switch component',
    category: 'input',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'checked',
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
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Disable the switch',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Label text',
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        default: 'blue',
        description: 'Switch color',
        enumValues: ['blue', 'red', 'green', 'purple', 'yellow', 'teal', 'orange'],
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<ToggleSwitch checked={switch1} label="Toggle me" onChange={setSwitch1} />`,
        description: 'Basic toggle switch',
      },
      {
        name: 'colors',
        code: `<ToggleSwitch checked={switch1} color="blue" label="Blue" onChange={setSwitch1} />
<ToggleSwitch checked={switch2} color="red" label="Red" onChange={setSwitch2} />
<ToggleSwitch checked={switch3} color="green" label="Green" onChange={setSwitch3} />`,
        description: 'Different colors',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'w-11', 'h-6', 'bg-gray-200', 'peer-focus:outline-none', 'peer-focus:ring-4',
        'peer-focus:ring-blue-300', 'dark:peer-focus:ring-blue-800', 'rounded-full',
        'peer', 'dark:bg-gray-700', 'peer-checked:after:translate-x-full',
        'peer-checked:after:border-white', 'after:content-[""]', 'after:absolute',
        'after:top-[2px]', 'after:left-[2px]', 'after:bg-white', 'after:border-gray-300',
        'after:border', 'after:rounded-full', 'after:h-5', 'after:w-5', 'after:transition-all',
        'dark:border-gray-600', 'peer-checked:bg-blue-600',
      ],
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
    name: 'dropdown',
    description: 'Dropdown menu component',
    category: 'navigation',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'label',
        type: 'ReactNode',
        required: true,
        description: 'Dropdown trigger label',
      },
      {
        name: 'dismissOnClick',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Close dropdown when item is clicked',
      },
      {
        name: 'inline',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Use inline style for label',
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        description: 'Dropdown size',
        enumValues: ['sm', 'md', 'lg'],
      },
      {
        name: 'placement',
        type: 'string',
        required: false,
        description: 'Dropdown placement',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Dropdown items',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Dropdown label="Dropdown button">
  <Dropdown.Item>Dashboard</Dropdown.Item>
  <Dropdown.Item>Settings</Dropdown.Item>
  <Dropdown.Item>Earnings</Dropdown.Item>
  <Dropdown.Divider />
  <Dropdown.Item>Sign out</Dropdown.Item>
</Dropdown>`,
        description: 'Basic dropdown',
      },
      {
        name: 'with-icons',
        code: `<Dropdown label="Dropdown">
  <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
  <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
  <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
  <Dropdown.Divider />
  <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
</Dropdown>`,
        description: 'Dropdown with icons',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'z-10', 'hidden', 'bg-white', 'divide-y', 'divide-gray-100', 'rounded-lg',
        'shadow', 'w-44', 'dark:bg-gray-700',
      ],
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
    name: 'spinner',
    description: 'Loading spinner component',
    category: 'feedback',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'md',
        description: 'Spinner size',
        enumValues: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        default: 'info',
        description: 'Spinner color',
        enumValues: ['failure', 'gray', 'info', 'pink', 'purple', 'success', 'warning'],
      },
      {
        name: 'light',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Use light color variant',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Spinner aria-label="Default status example" />`,
        description: 'Default spinner',
      },
      {
        name: 'colors',
        code: `<Spinner color="info" />
<Spinner color="success" />
<Spinner color="failure" />
<Spinner color="warning" />
<Spinner color="pink" />
<Spinner color="purple" />`,
        description: 'Different colors',
      },
      {
        name: 'sizes',
        code: `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`,
        description: 'Different sizes',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'inline', 'w-8', 'h-8', 'text-gray-200', 'animate-spin', 'dark:text-gray-600',
        'fill-blue-600',
      ],
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
    description: 'Notification toast component',
    category: 'feedback',
    install: {
      command: 'npm install flowbite-react',
      dependencies: ['flowbite-react'],
      devDependencies: [],
    },
    props: [
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 3000,
        description: 'Duration in milliseconds',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Toast content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Toast>
  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
    <HiCheck className="h-5 w-5" />
  </div>
  <div className="ml-3 text-sm font-normal">Item moved successfully.</div>
  <Toast.Toggle />
</Toast>`,
        description: 'Success toast',
      },
      {
        name: 'error',
        code: `<Toast>
  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
    <HiX className="h-5 w-5" />
  </div>
  <div className="ml-3 text-sm font-normal">Item has been deleted.</div>
  <Toast.Toggle />
</Toast>`,
        description: 'Error toast',
      },
    ],
    registry: 'flowbite',
    version: '2.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'items-center', 'w-full', 'max-w-xs', 'p-4', 'text-gray-500', 'bg-white',
        'rounded-lg', 'shadow', 'dark:text-gray-400', 'dark:bg-gray-800',
      ],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['alert'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
];

// ============================================================================
// Registry Manifest
// ============================================================================

export const FLOWBITE_REGISTRY_MANIFEST: MCPRegistryManifest = {
  name: 'flowbite',
  version: '2.0.0',
  description: 'Tailwind CSS components with Figma design system integration',
  components: FLOWBITE_COMPONENTS,
  capabilities: {
    supportsStreaming: true,
    supportsTheming: true,
    supportsCustomization: true,
    supportsAsyncInstall: true,
  },
  config: {
    baseUrl: 'https://mcp.flowbite.com',
    auth: {
      type: 'none',
      required: false,
    },
  },
  serverInfo: {
    name: 'flowbite-mcp-server',
    version: '1.0.0',
  },
};

// ============================================================================
// Tool Definitions
// ============================================================================

export const FLOWBITE_TOOLS: MCPTool[] = [
  {
    name: 'list_components',
    description: 'List all available Flowbite components',
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
    description: 'Get the installation command for Flowbite',
    inputSchema: {
      type: 'object',
      properties: {},
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
    name: 'get_figma_integration',
    description: 'Get Figma design system integration guide',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

export async function handleFlowbiteTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolCallResult> {
  switch (toolName) {
    case 'list_components': {
      const category = args.category as string | undefined;
      let components = FLOWBITE_COMPONENTS;
      
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
      const component = FLOWBITE_COMPONENTS.find(c => c.name === name);

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
            text: 'npm install flowbite-react',
          },
        ],
      };
    }

    case 'search_components': {
      const query = (args.query as string).toLowerCase();
      const results = FLOWBITE_COMPONENTS.filter(c =>
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

    case 'get_figma_integration': {
      const figmaGuide = {
        overview: 'Flowbite provides a Figma design system that matches the React components',
        figmaFile: 'https://www.figma.com/community/file/937576399068959552/Flowbite-Design-System',
        features: [
          'Auto-layout components',
          'Responsive variants',
          'Dark mode support',
          'Interactive components',
          'Design tokens',
        ],
        setup: [
          'Open the Figma community file',
          'Duplicate to your workspace',
          'Publish as team library',
          'Use components in your designs',
        ],
        sync: 'Designs in Figma map 1:1 with Flowbite React components',
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(figmaGuide, null, 2),
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

export const FLOWBITE_RESOURCES: MCPResource[] = [
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
    uri: 'registry://theme/dark-mode',
    name: 'Dark Mode Guide',
    description: 'Guide for implementing dark mode with Flowbite',
    mimeType: 'application/json',
  },
  ...FLOWBITE_COMPONENTS.map(c => ({
    uri: `registry://components/${c.name}`,
    name: c.name,
    description: c.description,
    mimeType: 'application/json',
  })),
];

// ============================================================================
// Resource Handlers
// ============================================================================

export async function handleFlowbiteResource(uri: string): Promise<MCPResourceContents> {
  if (uri === 'registry://manifest') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(FLOWBITE_REGISTRY_MANIFEST, null, 2),
    };
  }

  if (uri === 'registry://components') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(FLOWBITE_COMPONENTS.map(c => ({
        name: c.name,
        description: c.description,
        category: c.category,
      }))),
    };
  }

  if (uri === 'registry://theme/dark-mode') {
    const darkModeGuide = {
      setup: 'Flowbite supports dark mode via Tailwind CSS dark mode classes',
      configuration: `
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}`,
      usage: 'Add dark: prefix classes for dark mode styles',
      example: '<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">',
      toggle: 'Use a theme toggle to add/remove dark class from html element',
    };

    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(darkModeGuide, null, 2),
    };
  }

  const componentMatch = uri.match(/^registry:\/\/components\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    const component = FLOWBITE_COMPONENTS.find(c => c.name === componentName);

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

export function createFlowbiteMCPServer() {
  return {
    manifest: FLOWBITE_REGISTRY_MANIFEST,
    tools: FLOWBITE_TOOLS,
    resources: FLOWBITE_RESOURCES,
    handleTool: handleFlowbiteTool,
    handleResource: handleFlowbiteResource,
  };
}

export default createFlowbiteMCPServer;
