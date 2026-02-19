/**
 * codegen.ts
 *
 * Pure utility module for generating code artifacts from selected SchemaNodes.
 * No React imports, no hooks, no browser APIs — safe to import in any context.
 */

import type { SchemaNode, ComponentLibrary } from "@/types";
import type { SelectedEntry } from "@/hooks/useExtraction";
import { getFullRegistry } from "@/lib/registry";

// ============================================================================
// Public Types
// ============================================================================

export type Framework = "jsx" | "tsx" | "vue";
export type StylingOption = "tailwind" | "css-modules" | "styled-components";
export type MockFormat = "json" | "schema" | "faker" | "openapi";
export type InjectionPattern = "props" | "context" | "hook";

export interface CodegenOptions {
  framework: Framework;
  styling: StylingOption;
  includeInterface: boolean;
  includeImports: boolean;
  includeDefaults: boolean;
  mockFormat: MockFormat;
  injectionPattern: InjectionPattern;
}

export const DEFAULT_CODEGEN_OPTIONS: CodegenOptions = {
  framework: "tsx",
  styling: "tailwind",
  includeInterface: true,
  includeImports: true,
  includeDefaults: true,
  mockFormat: "json",
  injectionPattern: "hook",
};

export interface CodegenOutput {
  installCmd: string;
  importStatement: string;
  tsxSource: string;
  tsInterface: string;
  customHook: string;
  mockData: string;
}

// ============================================================================
// Internal Mappings
// ============================================================================

/** Library → npm packages to install (empty string = already in project) */
const LIBRARY_NPM_PACKAGES: Record<ComponentLibrary, string> = {
  core: "",
  aceternity: "tailwindcss-animate class-variance-authority clsx tailwind-merge framer-motion",
  "magic-ui": "framer-motion",
  "react-bits": "",
  chakra: "@chakra-ui/react @emotion/react @emotion/styled",
  material: "@mui/material @emotion/react @emotion/styled",
  shadcn: "",
};

/** Library → import path template ({componentName} is replaced at runtime) */
const LIBRARY_IMPORT_PATH: Record<ComponentLibrary, string> = {
  core: "@/components/ui/{componentName}",
  aceternity: "@/components/ui/{componentName}",
  "magic-ui": "@/components/magicui/{componentName}",
  "react-bits": "@/components/bits/{componentName}",
  chakra: "@chakra-ui/react",
  material: "@mui/material",
  shadcn: "@/components/ui/{componentName}",
};

// ============================================================================
// String Utilities
// ============================================================================

/** Convert a string to PascalCase */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

/** Convert a string to kebab-case */
function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, (match, c: string, offset: number) =>
      offset > 0 ? `-${c.toLowerCase()}` : c.toLowerCase()
    )
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

// ============================================================================
// Registry Helpers
// ============================================================================

/** Look up the ComponentLibrary for a given node.type; defaults to "core". */
function getLibraryForType(componentType: string): ComponentLibrary {
  try {
    const registry = getFullRegistry();
    const meta = registry[componentType as keyof typeof registry];
    if (meta && meta.library) {
      return meta.library as ComponentLibrary;
    }
  } catch {
    // Registry unavailable — fall back silently
  }
  return "core";
}

/** Resolve the npm install path for a library */
function getNpmPackages(library: ComponentLibrary): string {
  return LIBRARY_NPM_PACKAGES[library] ?? "";
}

/** Resolve the import path for a component, substituting the component name */
function getImportPath(library: ComponentLibrary, componentName: string): string {
  const template = LIBRARY_IMPORT_PATH[library] ?? LIBRARY_IMPORT_PATH.core;
  return template.replace("{componentName}", toKebabCase(componentName));
}

// ============================================================================
// Type Inference from Props
// ============================================================================

/** Infer a TypeScript type string from a runtime value */
function inferTsType(value: unknown): string {
  if (value === null || value === undefined) return "unknown";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const itemType = inferTsType(value[0]);
    return `${itemType}[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "Record<string, unknown>";
    const fields = entries
      .map(([k, v]) => `  ${k}: ${inferTsType(v)};`)
      .join("\n");
    return `{\n${fields}\n}`;
  }
  return "unknown";
}

// ============================================================================
// Mock Data Generation
// ============================================================================

/** Generate a realistic mock value for a given TypeScript type / runtime value */
function mockValueFor(key: string, value: unknown): unknown {
  if (typeof value === "string") {
    const lower = key.toLowerCase();
    if (lower.includes("title") || lower.includes("heading")) return "Lorem Ipsum Heading";
    if (lower.includes("description") || lower.includes("subtitle")) return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    if (lower.includes("label")) return "Button Label";
    if (lower.includes("href") || lower.includes("url") || lower.includes("link")) return "https://example.com";
    if (lower.includes("src") || lower.includes("image")) return "https://placehold.co/400x300";
    if (lower.includes("name")) return "John Doe";
    if (lower.includes("email")) return "user@example.com";
    if (lower.includes("placeholder")) return "Enter text here...";
    if (lower.includes("color")) return "#6366f1";
    if (lower.includes("variant")) return "default";
    if (lower.includes("size")) return "md";
    if (lower.includes("class") || lower.includes("className")) return "text-sm font-medium";
    return "Lorem ipsum";
  }
  if (typeof value === "number") return 42;
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) {
    return [
      { id: 1, label: "Item One" },
      { id: 2, label: "Item Two" },
      { id: 3, label: "Item Three" },
    ];
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, mockValueFor(k, v)])
    );
  }
  return null;
}

/** Build a plain mock object from a node's props */
function buildMockObject(props: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(props).map(([k, v]) => [k, mockValueFor(k, v)])
  );
}

// ============================================================================
// Code Section Generators
// ============================================================================

/** Generate the npm install command */
function generateInstallCmd(entries: SelectedEntry[]): string {
  const libs = new Set<ComponentLibrary>();
  for (const entry of entries) {
    libs.add(getLibraryForType(entry.node.type));
  }

  const packages = Array.from(
    new Set(
      Array.from(libs)
        .map(getNpmPackages)
        .filter((pkg) => pkg.trim().length > 0)
        .flatMap((pkg) => pkg.split(/\s+/))
    )
  );

  return packages.length > 0
    ? `npm install ${packages.join(" ")}`
    : "# All dependencies already installed";
}

/** Generate import statements for all unique component types in the entries */
function generateImportStatement(entries: SelectedEntry[], framework: Framework): string {
  // Group component names by their import path so we can batch imports
  const pathToComponents = new Map<string, string[]>();

  for (const entry of entries) {
    const componentName = entry.node.type;
    const library = getLibraryForType(componentName);
    const importPath = getImportPath(library, componentName);

    const existing = pathToComponents.get(importPath) ?? [];
    if (!existing.includes(componentName)) {
      existing.push(componentName);
    }
    pathToComponents.set(importPath, existing);
  }

  const lines: string[] = [];

  for (const [path, components] of pathToComponents.entries()) {
    const named = components.join(", ");
    lines.push(`import { ${named} } from "${path}";`);

    // For tsx, also emit type imports if available
    if (framework === "tsx" && components.length > 0) {
      const typeImports = components.map((c) => `${c}Props`).join(", ");
      lines.push(`import type { ${typeImports} } from "${path}";`);
    }
  }

  return lines.join("\n");
}

/** Generate a TypeScript interface from props */
function generateTsInterface(
  componentName: string,
  props: Record<string, unknown>,
  includeDefaults: boolean
): string {
  if (Object.keys(props).length === 0) {
    return `interface ${componentName}Props {\n  // No props defined\n}`;
  }

  const fields = Object.entries(props).map(([key, value]) => {
    const tsType = inferTsType(value);
    const defaultComment = includeDefaults ? ` // default: ${JSON.stringify(value)}` : "";
    return `  ${key}?: ${tsType};${defaultComment}`;
  });

  return `interface ${componentName}Props {\n${fields.join("\n")}\n}`;
}

/** Render a single SchemaNode as JSX/TSX string (shallow, one level) */
function renderNodeAsJsx(node: SchemaNode, styling: StylingOption): string {
  const props = node.props ?? {};
  const propsStr = Object.entries(props)
    .map(([k, v]) => {
      if (k === "className" && styling === "css-modules") {
        const cssClass = String(v).split(/\s+/)[0] ?? "root";
        return `className={styles.${toPascalCase(cssClass)}}`;
      }
      if (typeof v === "string") return `${k}="${v}"`;
      if (typeof v === "boolean") return v ? k : `${k}={false}`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join(" ");

  const hasChildren = node.children !== undefined && node.children !== null;
  const tag = node.type;

  if (!hasChildren) {
    return `<${tag}${propsStr ? ` ${propsStr}` : ""} />`;
  }

  const childContent =
    typeof node.children === "string"
      ? node.children
      : "{/* nested children */}";

  return `<${tag}${propsStr ? ` ${propsStr}` : ""}>\n  ${childContent}\n</${tag}>`;
}

/** Generate the tsx/jsx/vue source for the extracted component(s) */
function generateTsxSource(
  entries: SelectedEntry[],
  opts: CodegenOptions
): string {
  const { framework, styling, includeInterface } = opts;

  if (entries.length === 0) {
    return "// No components selected";
  }

  if (framework === "vue") {
    return generateVueSfc(entries, styling);
  }

  const isMulti = entries.length > 1;
  const componentName = isMulti
    ? "ExtractedComponents"
    : `Extracted${toPascalCase(entries[0].label)}`;

  const props = isMulti ? {} : (entries[0].node.props ?? {});

  const interfaceBlock =
    includeInterface && framework === "tsx"
      ? `${generateTsInterface(componentName, props, opts.includeDefaults)}\n\n`
      : "";

  const jsxBody = isMulti
    ? entries.map((e) => `  ${renderNodeAsJsx(e.node, styling)}`).join("\n")
    : `  ${renderNodeAsJsx(entries[0].node, styling)}`;

  const propsSignature =
    framework === "tsx"
      ? `props: ${componentName}Props`
      : `/** @param {Object} props */\nfunction ${componentName}(props)`;

  const cssModulesImport =
    styling === "css-modules"
      ? `import styles from "./${toKebabCase(componentName)}.module.css";\n\n`
      : "";

  const styledImport =
    styling === "styled-components"
      ? `import styled from "styled-components";\n\n`
      : "";

  if (framework === "tsx") {
    return [
      cssModulesImport,
      styledImport,
      interfaceBlock,
      `export function ${componentName}(${propsSignature}) {\n`,
      `  return (\n`,
      isMulti ? `    <>\n${jsxBody}\n    </>` : `    ${jsxBody}`,
      `\n  );\n}`,
    ].join("");
  }

  // jsx
  const jsDocComment = Object.keys(props).length > 0
    ? `/**\n${Object.entries(props).map(([k, v]) => ` * @param {${typeof v}} props.${k}`).join("\n")}\n */\n`
    : "";

  return [
    cssModulesImport,
    styledImport,
    jsDocComment,
    `export function ${componentName}({ ${Object.keys(props).join(", ")} }) {\n`,
    `  return (\n`,
    isMulti ? `    <>\n${jsxBody}\n    </>` : `    ${jsxBody}`,
    `\n  );\n}`,
  ].join("");
}

/** Generate a Vue 3 SFC */
function generateVueSfc(entries: SelectedEntry[], styling: StylingOption): string {
  const componentName = entries.length > 1
    ? "ExtractedComponents"
    : `Extracted${toPascalCase(entries[0].label)}`;

  const props = entries.length === 1 ? (entries[0].node.props ?? {}) : {};
  const propsKeys = Object.keys(props);

  const templateBody = entries.length > 1
    ? entries.map((e) => `  ${renderNodeAsJsx(e.node, styling)}`).join("\n")
    : `  ${renderNodeAsJsx(entries[0].node, styling)}`;

  const propsDefinition =
    propsKeys.length > 0
      ? `const props = defineProps<{\n${propsKeys.map((k) => `  ${k}?: ${inferTsType(props[k])};`).join("\n")}\n}>();`
      : "// No props";

  const styleBlock =
    styling === "css-modules"
      ? `<style module>\n/* Add styles here */\n</style>`
      : styling === "styled-components"
      ? `<style scoped>\n/* Styled-components not native in Vue — use scoped styles */\n</style>`
      : `<style scoped>\n/* Add Tailwind classes inline or here */\n</style>`;

  return [
    `<!-- ${componentName}.vue -->`,
    `<template>`,
    `  <div>`,
    templateBody,
    `  </div>`,
    `</template>`,
    ``,
    `<script setup lang="ts">`,
    propsDefinition,
    `</script>`,
    ``,
    styleBlock,
  ].join("\n");
}

/** Generate a TypeScript interface block */
function generateTsInterfaceBlock(
  entries: SelectedEntry[],
  opts: CodegenOptions
): string {
  if (entries.length === 0) return "// No components selected";

  if (entries.length === 1) {
    const componentName = `Extracted${toPascalCase(entries[0].label)}`;
    return generateTsInterface(componentName, entries[0].node.props ?? {}, opts.includeDefaults);
  }

  // Multiple entries: generate one interface per unique component type
  const seen = new Set<string>();
  const blocks: string[] = [];

  for (const entry of entries) {
    const componentName = `Extracted${toPascalCase(entry.label)}`;
    if (seen.has(componentName)) continue;
    seen.add(componentName);
    blocks.push(generateTsInterface(componentName, entry.node.props ?? {}, opts.includeDefaults));
  }

  return blocks.join("\n\n");
}

/** Generate a custom React hook or alternative injection patterns */
function generateCustomHook(entries: SelectedEntry[], opts: CodegenOptions): string {
  if (entries.length === 0) return "// No components selected";

  const isMulti = entries.length > 1;
  const baseName = isMulti
    ? "ExtractedComponents"
    : `Extracted${toPascalCase(entries[0].label)}`;

  const props = isMulti ? {} : (entries[0].node.props ?? {});
  // Use real props as the hook's initial data — these match what's actually on screen
  const mock = props;

  switch (opts.injectionPattern) {
    case "hook": {
      const hookName = `use${baseName}Data`;
      const mockJson = JSON.stringify(mock, null, 2);
      return [
        `import { useState } from "react";`,
        ``,
        `export function ${hookName}() {`,
        `  const [data] = useState(${mockJson});`,
        `  return data;`,
        `}`,
      ].join("\n");
    }

    case "props": {
      const mockJson = JSON.stringify(mock, null, 2);
      return [
        `// Spread props directly onto the component:`,
        `const ${baseName.charAt(0).toLowerCase() + baseName.slice(1)}Props = ${mockJson};`,
        ``,
        `// Usage:`,
        `// <${baseName} {...${baseName.charAt(0).toLowerCase() + baseName.slice(1)}Props} />`,
      ].join("\n");
    }

    case "context": {
      const contextName = `${baseName}Context`;
      const mockJson = JSON.stringify(mock, null, 2);
      return [
        `import { createContext, useContext } from "react";`,
        ``,
        `const defaultValue = ${mockJson};`,
        ``,
        `export const ${contextName} = createContext(defaultValue);`,
        ``,
        `export function use${baseName}Context() {`,
        `  return useContext(${contextName});`,
        `}`,
      ].join("\n");
    }

    default:
      return "// Unknown injection pattern";
  }
}

/** Generate mock data in the requested format — uses the real schema props, not generated fakes */
function generateMockData(entries: SelectedEntry[], opts: CodegenOptions): string {
  if (entries.length === 0) return "// No components selected";

  const isMulti = entries.length > 1;
  const componentName = isMulti
    ? "ExtractedComponents"
    : `Extracted${toPascalCase(entries[0].label)}`;
  const props = isMulti ? {} : (entries[0].node.props ?? {});
  // Use the real props as-is — these are the actual values driving the rendered component
  const mock = props;

  switch (opts.mockFormat) {
    case "json":
      return JSON.stringify(mock, null, 2);

    case "schema": {
      const schemaProps = Object.fromEntries(
        Object.entries(mock).map(([k, v]) => [
          k,
          { type: Array.isArray(v) ? "array" : typeof v, example: v },
        ])
      );
      return JSON.stringify(
        {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: `${componentName}Props`,
          type: "object",
          properties: schemaProps,
        },
        null,
        2
      );
    }

    case "faker": {
      const lines = Object.entries(props).map(([k, v]) => {
        const lower = k.toLowerCase();
        if (lower.includes("title") || lower.includes("heading"))
          return `  ${k}: faker.lorem.words(3),`;
        if (lower.includes("description") || lower.includes("subtitle"))
          return `  ${k}: faker.lorem.sentence(),`;
        if (lower.includes("name")) return `  ${k}: faker.person.fullName(),`;
        if (lower.includes("email")) return `  ${k}: faker.internet.email(),`;
        if (lower.includes("href") || lower.includes("url") || lower.includes("link"))
          return `  ${k}: faker.internet.url(),`;
        if (lower.includes("src") || lower.includes("image"))
          return `  ${k}: faker.image.url(),`;
        if (typeof v === "number") return `  ${k}: faker.number.int({ min: 1, max: 100 }),`;
        if (typeof v === "boolean") return `  ${k}: faker.datatype.boolean(),`;
        if (Array.isArray(v))
          return `  ${k}: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, label: faker.lorem.word() })),`;
        return `  ${k}: faker.lorem.word(),`;
      });

      return [
        `import { faker } from "@faker-js/faker";`,
        ``,
        `export const mock${componentName}Props = {`,
        ...lines,
        `};`,
      ].join("\n");
    }

    case "openapi": {
      const schemaProperties = Object.fromEntries(
        Object.entries(mock).map(([k, v]) => {
          const type = Array.isArray(v) ? "array" : typeof v === "object" ? "object" : typeof v;
          return [k, { type, example: v }];
        })
      );

      return JSON.stringify(
        {
          openapi: "3.0.0",
          components: {
            schemas: {
              [componentName + "Props"]: {
                type: "object",
                properties: schemaProperties,
              },
            },
          },
        },
        null,
        2
      );
    }

    default:
      return JSON.stringify(mock, null, 2);
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

/**
 * Generate all code artifacts for the given selected entries and options.
 *
 * This is a pure function: no side effects, no React, no browser APIs.
 */
export function generateCode(
  entries: SelectedEntry[],
  opts: CodegenOptions
): CodegenOutput {
  // Handle empty selection gracefully
  if (entries.length === 0) {
    return {
      installCmd: "# No components selected",
      importStatement: "// No components selected",
      tsxSource: "// No components selected",
      tsInterface: "// No components selected",
      customHook: "// No components selected",
      mockData: "{}",
    };
  }

  return {
    installCmd: generateInstallCmd(entries),
    importStatement: opts.includeImports
      ? generateImportStatement(entries, opts.framework)
      : "// Imports disabled",
    tsxSource: generateTsxSource(entries, opts),
    tsInterface: opts.includeInterface
      ? generateTsInterfaceBlock(entries, opts)
      : "// Interface generation disabled",
    customHook: generateCustomHook(entries, opts),
    mockData: generateMockData(entries, opts),
  };
}
