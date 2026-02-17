import type { ReactInterfaceSchema, SchemaNode } from "@/types";
import { componentSchemas, type ComponentName } from "@/lib/registry/schemas";

/**
 * Validates a React Interface Schema against the component registry.
 * Returns a list of validation errors, or empty array if valid.
 */
export function validateSchema(schema: ReactInterfaceSchema): string[] {
  const errors: string[] = [];

  if (!schema.version) {
    errors.push("Missing schema version");
  }

  if (!schema.root) {
    errors.push("Missing root node");
    return errors;
  }

  validateNode(schema.root, errors, "root");
  return errors;
}

function validateNode(node: SchemaNode, errors: string[], path: string): void {
  if (!node.type) {
    errors.push(`${path}: Missing type`);
    return;
  }

  // Check if component is registered
  if (!(node.type in componentSchemas)) {
    errors.push(`${path}: Unknown component "${node.type}"`);
  } else if (node.props) {
    // Validate props against schema
    const schema = componentSchemas[node.type as ComponentName];
    const result = schema.safeParse(node.props);
    if (!result.success) {
      // Don't fail hard — just note it. LLM output may not be perfect.
      for (const issue of result.error.issues) {
        errors.push(`${path}.props.${issue.path.join(".")}: ${issue.message}`);
      }
    }
  }

  // Recursively validate children
  if (Array.isArray(node.children)) {
    node.children.forEach((child, i) => {
      if (typeof child !== "string") {
        validateNode(child, errors, `${path}.children[${i}]`);
      }
    });
  }
}

/**
 * Extracts all component names used in a schema.
 */
export function extractComponentNames(schema: ReactInterfaceSchema): string[] {
  const names = new Set<string>();
  collectNames(schema.root, names);
  return Array.from(names);
}

function collectNames(node: SchemaNode, names: Set<string>): void {
  names.add(node.type);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (typeof child !== "string") {
        collectNames(child, names);
      }
    }
  }
}

/**
 * Counts the total number of nodes in a schema.
 */
export function countNodes(schema: ReactInterfaceSchema): number {
  return countNodeRecursive(schema.root);
}

function countNodeRecursive(node: SchemaNode): number {
  let count = 1;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (typeof child !== "string") {
        count += countNodeRecursive(child);
      }
    }
  }
  return count;
}

/**
 * Gets the maximum depth of a schema tree.
 */
export function getMaxDepth(schema: ReactInterfaceSchema): number {
  return getDepth(schema.root);
}

function getDepth(node: SchemaNode): number {
  if (!Array.isArray(node.children) || node.children.length === 0) {
    return 1;
  }
  const childDepths = node.children
    .filter((c): c is SchemaNode => typeof c !== "string")
    .map(getDepth);
  return 1 + Math.max(0, ...childDepths);
}

/**
 * Applies default props to nodes that are missing required props.
 */
export function applyDefaults(schema: ReactInterfaceSchema): ReactInterfaceSchema {
  return {
    ...schema,
    root: applyDefaultsToNode(schema.root),
  };
}

function applyDefaultsToNode(node: SchemaNode): SchemaNode {
  const componentName = node.type as ComponentName;
  const zodSchema = componentSchemas[componentName];

  let props = node.props ?? {};
  if (zodSchema) {
    // Use zod's parse with defaults to fill in missing values
    const result = zodSchema.safeParse(props);
    if (result.success) {
      props = result.data as Record<string, unknown>;
    }
  }

  let children = node.children;
  if (Array.isArray(children)) {
    children = children.map((child) =>
      typeof child === "string" ? child : applyDefaultsToNode(child)
    );
  }

  return { ...node, props, children };
}
