/**
 * Form Builder Schema
 * 
 * TypeScript types and utilities for the form builder.
 */

import { z } from 'zod';

// Field Types
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'rating'
  | 'slider'
  | 'color'
  | 'rich-text';

// Validation Rules
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: string | number | boolean;
  message?: string;
}

// Field Option (for select, radio, etc.)
export interface FieldOption {
  label: string;
  value: string;
}

// Form Field Definition
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  validation: ValidationRule[];
  options?: FieldOption[]; // For select, radio, multiselect
  defaultValue?: string | string[] | number | boolean;
  config?: {
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    accept?: string;
    multiple?: boolean;
  };
}

// Form Schema
export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitLabel: string;
    cancelLabel?: string;
    layout: 'vertical' | 'horizontal' | 'inline';
    columns: 1 | 2 | 3;
    showProgress: boolean;
    allowReset: boolean;
    validationMode: 'onChange' | 'onBlur' | 'onSubmit';
  };
}

// Form Templates
export const formTemplates: { id: string; name: string; description: string; schema: FormSchema }[] = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'A simple contact form with name, email, and message fields.',
    schema: {
      id: 'contact-form',
      title: 'Contact Us',
      description: 'We\'d love to hear from you. Send us a message!',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'John Doe',
          required: true,
          validation: [{ type: 'required', message: 'Name is required' }, { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }],
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'john@example.com',
          required: true,
          validation: [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Please enter a valid email' }],
        },
        {
          id: 'subject',
          type: 'select',
          label: 'Subject',
          required: true,
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Support', value: 'support' },
            { label: 'Sales', value: 'sales' },
            { label: 'Feedback', value: 'feedback' },
          ],
          validation: [{ type: 'required', message: 'Please select a subject' }],
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'How can we help you?',
          required: true,
          config: { rows: 5 },
          validation: [{ type: 'required', message: 'Message is required' }, { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' }],
        },
      ],
      settings: {
        submitLabel: 'Send Message',
        layout: 'vertical',
        columns: 1,
        showProgress: false,
        allowReset: true,
        validationMode: 'onBlur',
      },
    },
  },
  {
    id: 'registration',
    name: 'User Registration',
    description: 'Complete user registration form with validation.',
    schema: {
      id: 'registration-form',
      title: 'Create Account',
      description: 'Join thousands of users today',
      fields: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          placeholder: 'johndoe',
          required: true,
          validation: [
            { type: 'required', message: 'Username is required' },
            { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
            { type: 'pattern', value: '^[a-zA-Z0-9_]+$', message: 'Only letters, numbers, and underscores allowed' },
          ],
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'john@example.com',
          required: true,
          validation: [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Invalid email address' }],
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          placeholder: '••••••••',
          required: true,
          validation: [
            { type: 'required', message: 'Password is required' },
            { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
          ],
        },
        {
          id: 'confirmPassword',
          type: 'password',
          label: 'Confirm Password',
          placeholder: '••••••••',
          required: true,
          validation: [{ type: 'required', message: 'Please confirm your password' }],
        },
        {
          id: 'birthdate',
          type: 'date',
          label: 'Date of Birth',
          required: true,
          validation: [{ type: 'required', message: 'Date of birth is required' }],
        },
        {
          id: 'terms',
          type: 'checkbox',
          label: 'I agree to the Terms of Service and Privacy Policy',
          required: true,
          validation: [{ type: 'required', message: 'You must agree to the terms' }],
        },
      ],
      settings: {
        submitLabel: 'Create Account',
        layout: 'vertical',
        columns: 1,
        showProgress: true,
        allowReset: false,
        validationMode: 'onChange',
      },
    },
  },
  {
    id: 'survey',
    name: 'Customer Survey',
    description: 'Feedback survey with ratings and multiple choice.',
    schema: {
      id: 'survey-form',
      title: 'Customer Satisfaction Survey',
      description: 'Help us improve our services',
      fields: [
        {
          id: 'satisfaction',
          type: 'rating',
          label: 'How satisfied are you with our service?',
          required: true,
          config: { min: 1, max: 5 },
          validation: [{ type: 'required', message: 'Please rate our service' }],
        },
        {
          id: 'recommend',
          type: 'radio',
          label: 'How likely are you to recommend us?',
          required: true,
          options: [
            { label: 'Very Likely', value: '5' },
            { label: 'Likely', value: '4' },
            { label: 'Neutral', value: '3' },
            { label: 'Unlikely', value: '2' },
            { label: 'Very Unlikely', value: '1' },
          ],
          validation: [{ type: 'required', message: 'Please select an option' }],
        },
        {
          id: 'features',
          type: 'multiselect',
          label: 'Which features do you use most?',
          required: false,
          options: [
            { label: 'Dashboard', value: 'dashboard' },
            { label: 'Reports', value: 'reports' },
            { label: 'API', value: 'api' },
            { label: 'Integrations', value: 'integrations' },
            { label: 'Mobile App', value: 'mobile' },
          ],
        },
        {
          id: 'feedback',
          type: 'textarea',
          label: 'Additional Feedback',
          placeholder: 'Tell us more about your experience...',
          required: false,
          config: { rows: 4 },
        },
      ],
      settings: {
        submitLabel: 'Submit Survey',
        layout: 'vertical',
        columns: 1,
        showProgress: false,
        allowReset: true,
        validationMode: 'onSubmit',
      },
    },
  },
  {
    id: 'event',
    name: 'Event Registration',
    description: 'Event signup form with session selection.',
    schema: {
      id: 'event-form',
      title: 'Event Registration',
      description: 'Register for our upcoming conference',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true,
          validation: [{ type: 'required', message: 'First name is required' }],
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          required: true,
          validation: [{ type: 'required', message: 'Last name is required' }],
        },
        {
          id: 'email',
          type: 'email',
          label: 'Work Email',
          required: true,
          validation: [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Invalid email' }],
        },
        {
          id: 'company',
          type: 'text',
          label: 'Company',
          required: true,
          validation: [{ type: 'required', message: 'Company is required' }],
        },
        {
          id: 'jobTitle',
          type: 'select',
          label: 'Job Title',
          required: true,
          options: [
            { label: 'Developer', value: 'developer' },
            { label: 'Designer', value: 'designer' },
            { label: 'Manager', value: 'manager' },
            { label: 'Executive', value: 'executive' },
            { label: 'Other', value: 'other' },
          ],
          validation: [{ type: 'required', message: 'Job title is required' }],
        },
        {
          id: 'sessions',
          type: 'multiselect',
          label: 'Sessions You\'ll Attend',
          required: false,
          options: [
            { label: 'Keynote: The Future of AI', value: 'keynote' },
            { label: 'Workshop: Building with React', value: 'workshop-react' },
            { label: 'Panel: Design Systems', value: 'panel-design' },
            { label: 'Networking Lunch', value: 'lunch' },
          ],
        },
        {
          id: 'dietary',
          type: 'select',
          label: 'Dietary Requirements',
          required: false,
          options: [
            { label: 'None', value: 'none' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten Free', value: 'gluten-free' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
      settings: {
        submitLabel: 'Register',
        layout: 'vertical',
        columns: 2,
        showProgress: true,
        allowReset: true,
        validationMode: 'onBlur',
      },
    },
  },
];

// Field Type Definitions
export const fieldTypeDefinitions: { 
  type: FieldType; 
  label: string; 
  icon: string;
  description: string;
  hasOptions: boolean;
  defaultConfig?: Record<string, number | string | boolean>;
}[] = [
  { type: 'text', label: 'Text Input', icon: 'Type', description: 'Single line text input', hasOptions: false },
  { type: 'textarea', label: 'Text Area', icon: 'AlignLeft', description: 'Multi-line text input', hasOptions: false, defaultConfig: { rows: 4 } },
  { type: 'email', label: 'Email', icon: 'Mail', description: 'Email address input with validation', hasOptions: false },
  { type: 'password', label: 'Password', icon: 'Lock', description: 'Secure password input', hasOptions: false },
  { type: 'number', label: 'Number', icon: 'Hash', description: 'Numeric input', hasOptions: false },
  { type: 'tel', label: 'Phone', icon: 'Phone', description: 'Phone number input', hasOptions: false },
  { type: 'url', label: 'URL', icon: 'Link', description: 'Website URL input', hasOptions: false },
  { type: 'select', label: 'Dropdown', icon: 'ChevronDown', description: 'Single selection dropdown', hasOptions: true },
  { type: 'multiselect', label: 'Multi Select', icon: 'ListChecks', description: 'Multiple selection dropdown', hasOptions: true },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', description: 'Single checkbox', hasOptions: false },
  { type: 'radio', label: 'Radio Group', icon: 'CircleDot', description: 'Single choice from options', hasOptions: true },
  { type: 'switch', label: 'Toggle Switch', icon: 'ToggleLeft', description: 'On/off toggle', hasOptions: false },
  { type: 'date', label: 'Date Picker', icon: 'Calendar', description: 'Date selection', hasOptions: false },
  { type: 'datetime', label: 'Date & Time', icon: 'Clock', description: 'Date and time selection', hasOptions: false },
  { type: 'time', label: 'Time Picker', icon: 'Clock', description: 'Time selection', hasOptions: false },
  { type: 'file', label: 'File Upload', icon: 'Upload', description: 'File attachment', hasOptions: false },
  { type: 'rating', label: 'Star Rating', icon: 'Star', description: 'Rating from 1-5 stars', hasOptions: false, defaultConfig: { min: 1, max: 5 } },
  { type: 'slider', label: 'Slider', icon: 'SlidersHorizontal', description: 'Range slider', hasOptions: false, defaultConfig: { min: 0, max: 100, step: 1 } },
  { type: 'color', label: 'Color Picker', icon: 'Palette', description: 'Color selection', hasOptions: false },
  { type: 'rich-text', label: 'Rich Text', icon: 'FileText', description: 'Formatted text editor', hasOptions: false },
];

// Generate Zod schema from form fields
export function generateZodSchema(fields: FormField[]): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        schema = z.string().email();
        break;
      case 'number':
        schema = z.number();
        break;
      case 'checkbox':
      case 'switch':
        schema = z.boolean();
        break;
      case 'multiselect':
        schema = z.array(z.string());
        break;
      default:
        schema = z.string();
    }

    // Apply validation rules
    for (const rule of field.validation) {
      switch (rule.type) {
        case 'required':
          if (field.type === 'checkbox' || field.type === 'switch') {
            schema = (schema as z.ZodBoolean).refine((v) => v === true, { message: rule.message });
          } else if (field.type === 'multiselect') {
            schema = (schema as z.ZodArray<any>).min(1, rule.message);
          } else {
            schema = (schema as z.ZodString).min(1, rule.message);
          }
          break;
        case 'minLength':
          schema = (schema as z.ZodString).min(Number(rule.value), rule.message);
          break;
        case 'maxLength':
          schema = (schema as z.ZodString).max(Number(rule.value), rule.message);
          break;
        case 'min':
          schema = (schema as z.ZodNumber).min(Number(rule.value), rule.message);
          break;
        case 'max':
          schema = (schema as z.ZodNumber).max(Number(rule.value), rule.message);
          break;
        case 'pattern':
          schema = (schema as z.ZodString).regex(new RegExp(String(rule.value)), rule.message);
          break;
      }
    }

    // Make optional if not required
    if (!field.required && field.type !== 'checkbox' && field.type !== 'switch') {
      schema = schema.optional();
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}

// Export form to different formats
export function exportFormToJSON(schema: FormSchema): string {
  return JSON.stringify(schema, null, 2);
}

export function exportFormToTypeScript(schema: FormSchema): string {
  const interfaceName = schema.title.replace(/\s+/g, '') + 'Form';
  
  const fields = schema.fields.map((field) => {
    let type = 'string';
    if (field.type === 'number' || field.type === 'slider' || field.type === 'rating') type = 'number';
    if (field.type === 'checkbox' || field.type === 'switch') type = 'boolean';
    if (field.type === 'multiselect') type = 'string[]';
    if (field.type === 'date' || field.type === 'datetime') type = 'Date';
    
    const optional = !field.required ? '?' : '';
    return `  ${field.id}${optional}: ${type};`;
  }).join('\n');

  return `interface ${interfaceName} {
${fields}
}`;
}

export function exportFormToReactHookForm(schema: FormSchema): string {
  const interfaceName = schema.title.replace(/\s+/g, '') + 'Form';
  
  return `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
${schema.fields.map((f) => {
  let validation = 'z.string()';
  if (f.type === 'email') validation = 'z.string().email()';
  if (f.type === 'number') validation = 'z.number()';
  if (f.type === 'checkbox') validation = 'z.boolean()';
  if (f.required) validation += f.type === 'checkbox' ? '.refine(v => v === true)' : '.min(1)';
  return `  ${f.id}: ${validation},`;
}).join('\n')}
});

type ${interfaceName} = z.infer<typeof formSchema>;

export function ${interfaceName}Component() {
  const form = useForm<${interfaceName}>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: ${interfaceName}) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}`;
}

// Generate unique ID
export function generateId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
