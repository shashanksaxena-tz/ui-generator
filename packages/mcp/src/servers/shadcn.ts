/**
 * MCP Server Implementation - shadcn/ui
 * 
 * This module provides a complete MCP server implementation for shadcn/ui,
 * including all v4 components with their schemas, installation commands,
 * and examples.
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

const SHADCN_COMPONENTS: MCPComponentDefinition[] = [
  {
    name: 'button',
    description: 'Interactive button component with multiple variants and sizes',
    category: 'input',
    install: {
      command: 'npx shadcn add button',
      dependencies: ['@radix-ui/react-slot'],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'default',
        description: 'The visual style of the button',
        enumValues: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      },
      {
        name: 'size',
        type: 'string',
        required: false,
        default: 'default',
        description: 'The size of the button',
        enumValues: ['default', 'sm', 'lg', 'icon'],
      },
      {
        name: 'asChild',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Merge props onto the immediate child',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether the button is disabled',
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
        required: true,
        description: 'Button content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Button>Click me</Button>`,
        description: 'Default button',
      },
      {
        name: 'variants',
        code: `<div className="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>`,
        description: 'All button variants',
      },
      {
        name: 'sizes',
        code: `<div className="flex items-center gap-2">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon"><Icon name="plus" /></Button>
</div>`,
        description: 'All button sizes',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap',
        'rounded-md', 'text-sm', 'font-medium', 'ring-offset-background',
        'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2',
        'focus-visible:ring-ring', 'focus-visible:ring-offset-2',
        'disabled:pointer-events-none', 'disabled:opacity-50',
        'bg-primary', 'text-primary-foreground', 'hover:bg-primary/90',
        'h-10', 'px-4', 'py-2',
      ],
      cssVariables: ['--primary', '--primary-foreground', '--ring'],
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
    description: 'Container component for grouping related content',
    category: 'layout',
    install: {
      command: 'npx shadcn add card',
      dependencies: [],
      devDependencies: [],
    },
    props: [
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
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
        description: 'Complete card with all sections',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm',
      ],
      cssVariables: ['--card', '--card-foreground'],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['region'],
      keyboardNavigation: false,
      screenReaderSupport: true,
    },
  },
  {
    name: 'dialog',
    description: 'Modal dialog window built on Radix UI Dialog primitive',
    category: 'overlay',
    install: {
      command: 'npx shadcn add dialog',
      dependencies: ['@radix-ui/react-dialog'],
      devDependencies: [],
    },
    props: [
      {
        name: 'open',
        type: 'boolean',
        required: false,
        description: 'Controlled open state',
      },
      {
        name: 'onOpenChange',
        type: 'function',
        required: false,
        description: 'Callback when open state changes',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Dialog content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a dialog description.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog content goes here.</p>
    </div>
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
        description: 'Complete dialog example',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'fixed', 'inset-0', 'z-50', 'bg-black/80', 'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
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
    name: 'input',
    description: 'Form input component',
    category: 'input',
    install: {
      command: 'npx shadcn add input',
      dependencies: [],
      devDependencies: [],
    },
    props: [
      {
        name: 'type',
        type: 'string',
        required: false,
        default: 'text',
        description: 'Input type',
        enumValues: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      },
      {
        name: 'placeholder',
        type: 'string',
        required: false,
        description: 'Placeholder text',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether the input is disabled',
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'Controlled value',
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
        code: `<Input placeholder="Enter your email" />`,
        description: 'Basic input',
      },
      {
        name: 'with-label',
        code: `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>`,
        description: 'Input with label',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input',
        'bg-background', 'px-3', 'py-2', 'text-sm', 'ring-offset-background',
        'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium',
        'placeholder:text-muted-foreground', 'focus-visible:outline-none',
        'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed', 'disabled:opacity-50',
      ],
      cssVariables: ['--input', '--background', '--ring', '--muted-foreground'],
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
    description: 'Dropdown select component built on Radix UI Select',
    category: 'input',
    install: {
      command: 'npx shadcn add select',
      dependencies: ['@radix-ui/react-select'],
      devDependencies: [],
    },
    props: [
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'Controlled value',
      },
      {
        name: 'onValueChange',
        type: 'function',
        required: false,
        description: 'Value change handler',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether the select is disabled',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Select content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
        description: 'Basic select with groups',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'h-10', 'w-full', 'items-center', 'justify-between', 'rounded-md',
        'border', 'border-input', 'bg-background', 'px-3', 'py-2', 'text-sm',
        'ring-offset-background', 'placeholder:text-muted-foreground',
        'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2',
        'disabled:cursor-not-allowed', 'disabled:opacity-50',
      ],
      cssVariables: ['--input', '--background', '--ring', '--muted-foreground'],
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
    description: 'Tabbed interface component',
    category: 'navigation',
    install: {
      command: 'npx shadcn add tabs',
      dependencies: ['@radix-ui/react-tabs'],
      devDependencies: [],
    },
    props: [
      {
        name: 'value',
        type: 'string',
        required: false,
        description: 'Controlled active tab value',
      },
      {
        name: 'onValueChange',
        type: 'function',
        required: false,
        description: 'Tab change handler',
      },
      {
        name: 'defaultValue',
        type: 'string',
        required: false,
        description: 'Default active tab',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Tab components',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Account settings here.</p>
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Password settings here.</p>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>`,
        description: 'Complete tabs example',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'inline-flex', 'h-10', 'items-center', 'justify-center', 'rounded-md',
        'bg-muted', 'p-1', 'text-muted-foreground',
      ],
      cssVariables: ['--muted', '--muted-foreground'],
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
      command: 'npx shadcn add accordion',
      dependencies: ['@radix-ui/react-accordion'],
      devDependencies: [],
    },
    props: [
      {
        name: 'type',
        type: 'string',
        required: false,
        default: 'single',
        description: 'Accordion behavior',
        enumValues: ['single', 'multiple'],
      },
      {
        name: 'collapsible',
        type: 'boolean',
        required: false,
        description: 'Allow collapsing all items (single type only)',
      },
      {
        name: 'defaultValue',
        type: 'string',
        required: false,
        description: 'Default open item value',
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
        code: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles that match the other components.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
        description: 'Basic accordion',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'flex-1', 'items-center', 'justify-between', 'py-4', 'font-medium',
        'transition-all', 'hover:underline', '[&[data-state=open]>svg]:rotate-180',
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
      command: 'npx shadcn add tooltip',
      dependencies: ['@radix-ui/react-tooltip'],
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
        name: 'side',
        type: 'string',
        required: false,
        default: 'top',
        description: 'Tooltip position',
        enumValues: ['top', 'right', 'bottom', 'left'],
      },
      {
        name: 'align',
        type: 'string',
        required: false,
        default: 'center',
        description: 'Tooltip alignment',
        enumValues: ['start', 'center', 'end'],
      },
      {
        name: 'delayDuration',
        type: 'number',
        required: false,
        default: 200,
        description: 'Delay before showing tooltip (ms)',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`,
        description: 'Basic tooltip',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'z-50', 'overflow-hidden', 'rounded-md', 'border', 'bg-popover',
        'px-3', 'py-1.5', 'text-sm', 'text-popover-foreground', 'shadow-md',
        'animate-in', 'fade-in-0', 'zoom-in-95',
        'data-[state=closed]:animate-out', 'data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
      ],
      cssVariables: ['--popover', '--popover-foreground'],
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
      command: 'npx shadcn add badge',
      dependencies: [],
      devDependencies: [],
    },
    props: [
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'default',
        description: 'Badge style variant',
        enumValues: ['default', 'secondary', 'destructive', 'outline'],
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
        code: `<Badge>Badge</Badge>`,
        description: 'Default badge',
      },
      {
        name: 'variants',
        code: `<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>
</div>`,
        description: 'All badge variants',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5',
        'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none',
        'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2',
        'border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80',
      ],
      cssVariables: ['--primary', '--primary-foreground', '--ring'],
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
      command: 'npx shadcn add avatar',
      dependencies: ['@radix-ui/react-avatar'],
      devDependencies: [],
    },
    props: [
      {
        name: 'src',
        type: 'string',
        required: false,
        description: 'Image source URL',
      },
      {
        name: 'alt',
        type: 'string',
        required: false,
        description: 'Image alt text',
      },
      {
        name: 'fallback',
        type: 'ReactNode',
        required: false,
        description: 'Fallback content when image fails to load',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
        description: 'Avatar with fallback',
      },
      {
        name: 'sizes',
        code: `<div className="flex gap-4">
  <Avatar className="h-8 w-8">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>SM</AvatarFallback>
  </Avatar>
  <Avatar className="h-12 w-12">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>MD</AvatarFallback>
  </Avatar>
  <Avatar className="h-16 w-16">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>LG</AvatarFallback>
  </Avatar>
</div>`,
        description: 'Different avatar sizes',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'relative', 'flex', 'h-10', 'w-10', 'shrink-0', 'overflow-hidden', 'rounded-full',
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
    description: 'Data table component',
    category: 'data',
    install: {
      command: 'npx shadcn add table',
      dependencies: [],
      devDependencies: [],
    },
    props: [
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
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        description: 'Complete table example',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'w-full', 'caption-bottom', 'text-sm',
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
    name: 'switch',
    description: 'Toggle switch control',
    category: 'input',
    install: {
      command: 'npx shadcn add switch',
      dependencies: ['@radix-ui/react-switch'],
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
        name: 'onCheckedChange',
        type: 'function',
        required: false,
        description: 'Checked state change handler',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: false,
        description: 'Whether the switch is disabled',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`,
        description: 'Switch with label',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'peer', 'inline-flex', 'h-6', 'w-11', 'shrink-0', 'cursor-pointer',
        'items-center', 'rounded-full', 'border-2', 'border-transparent',
        'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2',
        'focus-visible:ring-ring', 'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background', 'disabled:cursor-not-allowed',
        'disabled:opacity-50', 'data-[state=checked]:bg-primary',
        'data-[state=unchecked]:bg-input',
      ],
      cssVariables: ['--primary', '--input', '--ring', '--background'],
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
    description: 'Range slider control',
    category: 'input',
    install: {
      command: 'npx shadcn add slider',
      dependencies: ['@radix-ui/react-slider'],
      devDependencies: [],
    },
    props: [
      {
        name: 'value',
        type: 'number[]',
        required: false,
        description: 'Controlled value(s)',
      },
      {
        name: 'onValueChange',
        type: 'function',
        required: false,
        description: 'Value change handler',
      },
      {
        name: 'defaultValue',
        type: 'number[]',
        required: false,
        description: 'Default value(s)',
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
    ],
    examples: [
      {
        name: 'default',
        code: `<Slider defaultValue={[50]} max={100} step={1} />`,
        description: 'Basic slider',
      },
      {
        name: 'range',
        code: `<Slider defaultValue={[25, 75]} max={100} step={1} />`,
        description: 'Range slider with two handles',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'relative', 'flex', 'w-full', 'touch-none', 'select-none', 'items-center',
      ],
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
    description: 'Progress indicator',
    category: 'feedback',
    install: {
      command: 'npx shadcn add progress',
      dependencies: ['@radix-ui/react-progress'],
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
        name: 'max',
        type: 'number',
        required: false,
        default: 100,
        description: 'Maximum value',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Progress value={33} />`,
        description: 'Basic progress bar',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'relative', 'h-4', 'w-full', 'overflow-hidden', 'rounded-full', 'bg-secondary',
      ],
      cssVariables: ['--secondary'],
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
    description: 'Loading placeholder',
    category: 'feedback',
    install: {
      command: 'npx shadcn add skeleton',
      dependencies: [],
      devDependencies: [],
    },
    props: [
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>`,
        description: 'Skeleton for card loading state',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'animate-pulse', 'rounded-md', 'bg-muted',
      ],
      cssVariables: ['--muted'],
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
    description: 'Notification message component',
    category: 'feedback',
    install: {
      command: 'npx shadcn add toast',
      dependencies: ['@radix-ui/react-toast'],
      devDependencies: [],
    },
    props: [
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Toast title',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Toast description',
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        default: 'default',
        description: 'Toast variant',
        enumValues: ['default', 'destructive'],
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        default: 5000,
        description: 'Duration in milliseconds',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `const { toast } = useToast()

return (
  <Button
    onClick={() => {
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2024 at 5:57 PM",
      })
    }}
  >
    Show Toast
  </Button>
)`,
        description: 'Basic toast notification',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'group', 'pointer-events-auto', 'relative', 'flex', 'w-full', 'items-center',
        'justify-between', 'space-x-4', 'overflow-hidden', 'rounded-md', 'border',
        'p-6', 'pr-8', 'shadow-lg', 'transition-all', 'data-[swipe=cancel]:translate-x-0',
        'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
        'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
        'data-[swipe=move]:transition-none', 'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out', 'data-[swipe=end]:animate-out',
        'data-[state=closed]:fade-out-80', 'data-[state=closed]:slide-out-to-right-full',
        'data-[state=open]:slide-in-from-top-full', 'data-[state=open]:sm:slide-in-from-bottom-full',
      ],
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
    name: 'dropdown-menu',
    description: 'Contextual menu component',
    category: 'navigation',
    install: {
      command: 'npx shadcn add dropdown-menu',
      dependencies: ['@radix-ui/react-dropdown-menu'],
      devDependencies: [],
    },
    props: [
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
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: 'Complete dropdown menu',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'z-50', 'min-w-[8rem]', 'overflow-hidden', 'rounded-md', 'border',
        'bg-popover', 'p-1', 'text-popover-foreground', 'shadow-md',
        'data-[state=open]:animate-in', 'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0', 'data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95', 'data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
      ],
      cssVariables: ['--popover', '--popover-foreground'],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['menu'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'calendar',
    description: 'Date picker calendar component',
    category: 'input',
    install: {
      command: 'npx shadcn add calendar',
      dependencies: ['react-day-picker', 'date-fns'],
      devDependencies: [],
    },
    props: [
      {
        name: 'mode',
        type: 'string',
        required: false,
        default: 'single',
        description: 'Selection mode',
        enumValues: ['single', 'multiple', 'range'],
      },
      {
        name: 'selected',
        type: 'Date | Date[] | DateRange',
        required: false,
        description: 'Selected date(s)',
      },
      {
        name: 'onSelect',
        type: 'function',
        required: false,
        description: 'Date selection handler',
      },
      {
        name: 'disabled',
        type: 'boolean | Date | Date[] | Matcher',
        required: false,
        description: 'Disabled dates',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>`,
        description: 'Single date selection',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'p-3', 'pointer-events-auto',
      ],
      cssVariables: [],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['grid'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
  {
    name: 'command',
    description: 'Command palette / searchable list component',
    category: 'input',
    install: {
      command: 'npx shadcn add command',
      dependencies: ['cmdk'],
      devDependencies: [],
    },
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Command content',
      },
    ],
    examples: [
      {
        name: 'default',
        code: `<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
        description: 'Basic command palette',
      },
    ],
    registry: 'shadcn',
    version: '4.0.0',
    styling: {
      tailwindClasses: [
        'flex', 'h-full', 'w-full', 'flex-col', 'overflow-hidden', 'rounded-md',
        'bg-popover', 'text-popover-foreground',
      ],
      cssVariables: ['--popover', '--popover-foreground'],
      themeCompatible: true,
    },
    accessibility: {
      ariaRoles: ['listbox'],
      keyboardNavigation: true,
      screenReaderSupport: true,
    },
  },
];

// ============================================================================
// Registry Manifest
// ============================================================================

export const SHADCN_REGISTRY_MANIFEST: MCPRegistryManifest = {
  name: 'shadcn',
  version: '4.0.0',
  description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
  components: SHADCN_COMPONENTS,
  capabilities: {
    supportsStreaming: true,
    supportsTheming: true,
    supportsCustomization: true,
    supportsAsyncInstall: true,
  },
  config: {
    baseUrl: 'https://mcp.shadcn.com',
    auth: {
      type: 'none',
      required: false,
    },
  },
  serverInfo: {
    name: 'shadcn-mcp-server',
    version: '1.0.0',
  },
};

// ============================================================================
// Tool Definitions
// ============================================================================

export const SHADCN_TOOLS: MCPTool[] = [
  {
    name: 'list_components',
    description: 'List all available shadcn/ui components',
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
    description: 'Get the installation command for components',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Component names to install',
        },
      },
      required: ['components'],
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
];

// ============================================================================
// Tool Handlers
// ============================================================================

export async function handleShadcnTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<MCPToolCallResult> {
  switch (toolName) {
    case 'list_components': {
      const category = args.category as string | undefined;
      let components = SHADCN_COMPONENTS;
      
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
      const component = SHADCN_COMPONENTS.find(c => c.name === name);

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
      const components = args.components as string[];
      const installCommands = components.map(name => {
        const component = SHADCN_COMPONENTS.find(c => c.name === name);
        if (!component) return `# Component not found: ${name}`;
        return component.install.command;
      });

      return {
        content: [
          {
            type: 'text',
            text: installCommands.join(' && '),
          },
        ],
      };
    }

    case 'search_components': {
      const query = (args.query as string).toLowerCase();
      const results = SHADCN_COMPONENTS.filter(c =>
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

export const SHADCN_RESOURCES: MCPResource[] = [
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
  ...SHADCN_COMPONENTS.map(c => ({
    uri: `registry://components/${c.name}`,
    name: c.name,
    description: c.description,
    mimeType: 'application/json',
  })),
];

// ============================================================================
// Resource Handlers
// ============================================================================

export async function handleShadcnResource(uri: string): Promise<MCPResourceContents> {
  if (uri === 'registry://manifest') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(SHADCN_REGISTRY_MANIFEST, null, 2),
    };
  }

  if (uri === 'registry://components') {
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(SHADCN_COMPONENTS.map(c => ({
        name: c.name,
        description: c.description,
        category: c.category,
      }))),
    };
  }

  const componentMatch = uri.match(/^registry:\/\/components\/(.+)$/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    const component = SHADCN_COMPONENTS.find(c => c.name === componentName);

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

export function createShadcnMCPServer() {
  return {
    manifest: SHADCN_REGISTRY_MANIFEST,
    tools: SHADCN_TOOLS,
    resources: SHADCN_RESOURCES,
    handleTool: handleShadcnTool,
    handleResource: handleShadcnResource,
  };
}

export default createShadcnMCPServer;
